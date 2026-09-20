import React, { useEffect, useMemo, useState } from 'react';
import { StudentProfile } from '../../types';
import { supabase } from '../../lib/supabase';
import { isSupabaseConfigured } from '../../lib/config';

interface QuizDuelScreenProps {
  student: StudentProfile;
  isHindi: boolean;
}

type DuelRoom = {
  id: string;
  code: string;
  created_by: string;
  opponent_id: string | null;
  status: 'waiting' | 'active' | 'finished';
  round: number;
};

type Answer = {
  round: number;
  student_id: string;
  answer: string;
  correct: boolean;
  points: number;
};

const QUESTIONS = [
  { topic: 'Fractions', text: 'Which fraction is greater?', options: ['5/8', '7/12'], correct: '5/8' },
  { topic: 'Percentages', text: 'What is 25% of 80?', options: ['20', '25'], correct: '20' },
  { topic: 'Ratio', text: 'If 3 pens cost ₹30, what do 5 pens cost?', options: ['₹50', '₹45'], correct: '₹50' },
  { topic: 'Integers', text: 'What is 18 − 25?', options: ['−7', '7'], correct: '−7' },
  { topic: 'LCM', text: 'What is the LCM of 6 and 8?', options: ['24', '48'], correct: '24' },
];

export const QuizDuelScreen: React.FC<QuizDuelScreenProps> = ({ student, isHindi }) => {
  const [room, setRoom] = useState<DuelRoom | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [message, setMessage] = useState('Create a duel and share the code with another logged-in student.');
  const [busy, setBusy] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

  const question = useMemo(() => QUESTIONS[Math.max(0, (room?.round ?? 1) - 1)], [room?.round]);

  const refreshRoom = async (roomId: string) => {
    if (!supabase) return;
    const { data: r } = await supabase.from('duel_rooms').select('*').eq('id', roomId).single();
    if (r) setRoom(r as DuelRoom);
    const { data: a } = await supabase.from('duel_answers').select('round,student_id,answer,correct,points').eq('room_id', roomId).order('round');
    const rows = (a ?? []) as Answer[];
    setAnswers(rows);
    const next: Record<string, number> = {};
    rows.forEach((x) => { next[x.student_id] = (next[x.student_id] ?? 0) + x.points; });
    setScores(next);
  };

  useEffect(() => {
    if (!room || !supabase) return;
    refreshRoom(room.id);
    const client = supabase;
    const channel = client
      .channel(`live-duel-${room.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'duel_rooms', filter: `id=eq.${room.id}` }, () => refreshRoom(room.id))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'duel_answers', filter: `room_id=eq.${room.id}` }, () => refreshRoom(room.id))
      .subscribe();
    const poll = setInterval(() => refreshRoom(room.id), 3000);
    return () => { clearInterval(poll); client.removeChannel(channel); };
  }, [room?.id]);

  useEffect(() => {
    setSelected(null);
  }, [room?.round]);

  const createDuel = async () => {
    if (!supabase || !isSupabaseConfigured()) return setMessage('Supabase is not configured.');
    setBusy(true);
    setMessage('Creating live duel…');
    const code = `DUEL-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const { data, error } = await supabase.from('duel_rooms').insert({ code, created_by: student.id }).select('*').single();
    setBusy(false);
    if (error) return setMessage(error.message);
    setRoom(data as DuelRoom);
    setMessage(`Duel created. Share code ${data.code} with the other student.`);
  };

  const joinDuel = async () => {
    if (!supabase || !isSupabaseConfigured()) return setMessage('Supabase is not configured.');
    if (!joinCode.trim()) return setMessage('Enter the duel code first.');
    setBusy(true);
    const { data, error } = await supabase.rpc('join_duel', { p_code: joinCode.trim().toUpperCase() });
    setBusy(false);
    if (error) return setMessage(error.message);
    setRoom(data as DuelRoom);
    setMessage('Joined. Both students are now connected through Supabase Realtime.');
  };

  const submitAnswer = async (answer: string) => {
    if (!room || room.status !== 'active' || selected || !supabase) return;
    setSelected(answer);
    const correct = answer === question.correct;
    const points = correct ? 100 : 0;
    const { error } = await supabase.from('duel_answers').insert({
      room_id: room.id,
      round: room.round,
      student_id: student.id,
      answer,
      correct,
      points,
    });
    if (error) { setSelected(null); setMessage(error.message); return; }

    // The first answer is visible immediately. Once both students have answered,
    // advance the shared room to the next round. The small transaction-like guard
    // prevents the round from moving more than once.
    const { data: current } = await supabase.from('duel_answers').select('student_id').eq('room_id', room.id).eq('round', room.round);
    const participantCount = new Set((current ?? []).map((x: any) => x.student_id)).size;
    if (participantCount >= 2) {
      const nextRound = room.round + 1;
      if (nextRound <= QUESTIONS.length) {
        await supabase.from('duel_rooms').update({ round: nextRound }).eq('id', room.id).eq('round', room.round);
      } else {
        await supabase.from('duel_rooms').update({ status: 'finished', finished_at: new Date().toISOString() }).eq('id', room.id).eq('status', 'active');
      }
    }
  };

  const leave = () => { setRoom(null); setAnswers([]); setSelected(null); setScores({}); setMessage('Create a duel and share the code with another logged-in student.'); };

  if (!isSupabaseConfigured()) {
    return <div className="p-6 rounded-2xl bg-amber-50 text-amber-900">Live Duel requires the connected Supabase version.</div>;
  }

  if (!room) {
    return (
      <div className="flex flex-col gap-4 pb-6 animate-fadeIn">
        <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container-highest shadow-sm">
          <div className="flex items-center gap-2 mb-2"><span className="material-symbols-outlined text-primary">swords</span><h1 className="font-display text-xl font-extrabold text-primary">Live Quiz Duel</h1></div>
          <p className="text-sm text-on-surface-variant">Use two laptops, two real student accounts and one shared duel code. Results are stored in Supabase.</p>
        </div>
        <button disabled={busy} onClick={createDuel} className="h-12 rounded-xl bg-primary text-white font-bold">Create Duel</button>
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest">
          <label className="text-xs font-bold text-primary">Join another student's duel</label>
          <input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="DUEL-ABCDE" className="w-full mt-2 p-3 rounded-xl bg-surface-container border border-surface-container-highest" />
          <button disabled={busy} onClick={joinDuel} className="w-full mt-2 h-11 rounded-xl bg-secondary text-white font-bold">Join Duel</button>
        </div>
        <div className="text-xs text-on-surface-variant text-center">{message}</div>
      </div>
    );
  }

  const myScore = scores[student.id] ?? 0;
  const otherId = room.created_by === student.id ? room.opponent_id : room.created_by;
  const otherScore = otherId ? (scores[otherId] ?? 0) : 0;
  const myAnswer = answers.find((a) => a.round === room.round && a.student_id === student.id);
  const otherAnswered = !!answers.find((a) => a.round === room.round && a.student_id !== student.id);

  return (
    <div className="flex flex-col gap-4 pb-6 animate-fadeIn">
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest shadow-sm">
        <div className="flex justify-between items-start gap-2"><div><h1 className="font-display text-xl font-extrabold text-primary">Live Quiz Duel</h1><p className="text-xs text-on-surface-variant">Code: <strong>{room.code}</strong> • Round {Math.min(room.round, QUESTIONS.length)}/{QUESTIONS.length}</p></div><button onClick={leave} className="text-xs font-bold text-error">Leave</button></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-primary text-white"><div className="text-xs opacity-80">You</div><div className="text-2xl font-extrabold">{myScore}</div></div>
        <div className="p-3 rounded-xl bg-secondary text-white"><div className="text-xs opacity-80">Opponent</div><div className="text-2xl font-extrabold">{otherScore}</div></div>
      </div>

      {room.status === 'waiting' ? (
        <div className="p-6 rounded-2xl bg-surface-container-lowest text-center border border-surface-container-highest"><div className="text-lg font-bold text-primary">Waiting for opponent…</div><div className="text-sm text-on-surface-variant mt-2">Open the app on the second laptop, log in as another student and join with <strong>{room.code}</strong>.</div></div>
      ) : room.status === 'finished' ? (
        <div className="p-6 rounded-2xl bg-tertiary-fixed text-tertiary text-center"><div className="text-xl font-extrabold">Duel finished</div><div className="text-sm mt-1">{myScore === otherScore ? 'Draw!' : myScore > otherScore ? 'You won this round set.' : 'Your opponent won this round set.'}</div></div>
      ) : (
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest shadow-sm">
          <div className="text-xs font-bold text-secondary mb-2">{question.topic}</div>
          <h2 className="text-lg font-bold text-primary">{question.text}</h2>
          <div className="grid grid-cols-2 gap-3 mt-4">{question.options.map((option) => <button key={option} disabled={!!myAnswer} onClick={() => submitAnswer(option)} className={`p-4 rounded-xl border font-bold ${myAnswer?.answer === option ? 'bg-primary text-white' : 'bg-surface-container text-primary border-surface-container-highest'}`}>{option}</button>)}</div>
          <div className="mt-3 text-xs text-on-surface-variant text-center">{myAnswer ? (otherAnswered ? 'Both answered — next round syncing…' : 'Answer saved. Waiting for opponent…') : 'Choose one answer.'}</div>
        </div>
      )}

      <div className="text-xs text-center text-on-surface-variant">{message}</div>
      <div className="text-[11px] text-center text-tertiary">● Live data • Supabase Realtime + database persistence</div>
    </div>
  );
};
