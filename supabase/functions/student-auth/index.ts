import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const publicClient = createClient(supabaseUrl, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function internalEmail(samagraId: string) {
  const normalized = samagraId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
  return `student-${normalized}@auth.shikshasaarthi.internal`;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const body = await req.json();
    const action = body?.action;
    const samagraId = String(body?.samagraId ?? '').trim();
    const pin = String(body?.pin ?? '');
    const classCode = String(body?.classCode ?? '').trim().toUpperCase();

    if (!samagraId || pin.length < 6) {
      return json({ error: 'Student ID and a 6-digit PIN are required.' }, 400);
    }

    const email = internalEmail(samagraId);

    if (action === 'signup') {
      const profile = body?.profile ?? {};
      if (!profile.name || !profile.schoolName || !classCode) {
        return json({ error: 'Name, school and a valid Class Code are required.' }, 400);
      }

      const { data: classRow, error: classError } = await admin
        .from('teacher_classes')
        .select('id, teacher_id, class_name, section, class_code')
        .eq('class_code', classCode)
        .maybeSingle();
      if (classError) return json({ error: classError.message }, 500);
      if (!classRow) return json({ error: 'Invalid Class Code. Ask your teacher for the current code.' }, 400);

      const { data: existingStudent, error: existingError } = await admin
        .from('students')
        .select('id')
        .eq('samagra_id', samagraId)
        .maybeSingle();
      if (existingError) return json({ error: existingError.message }, 500);
      if (existingStudent) return json({ error: 'This Student/Samagra ID is already registered.' }, 409);

      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password: pin,
        email_confirm: true,
        user_metadata: { role: 'student', samagra_id: samagraId },
      });
      if (createError) {
        if (createError.message.toLowerCase().includes('already') || createError.status === 422) {
          return json({ error: 'This Student/Samagra ID is already registered.' }, 409);
        }
        return json({ error: createError.message }, 400);
      }

      const userId = created.user?.id;
      if (!userId) return json({ error: 'Account was created without a user id.' }, 500);

      const { error: profileError } = await admin.from('students').insert({
        id: userId,
        name: profile.name,
        samagra_id: samagraId,
        roll_no: profile.rollNo ?? '',
        class_name: `${classRow.class_name}${classRow.section}`, 
        school_name: profile.schoolName,
        udise_code: profile.udiseCode ?? '',
        avatar_color: profile.avatarColor ?? 'blue',
        preferred_language: profile.preferredLanguage ?? 'en',
        teacher_id: classRow.teacher_id,
        class_code: classRow.class_code,
      });

      if (profileError) {
        await admin.auth.admin.deleteUser(userId);
        if (profileError.code === '23505') return json({ error: 'This Student/Samagra ID is already registered.' }, 409);
        return json({ error: profileError.message }, 400);
      }

      const { error: enrollmentError } = await admin.from('teacher_students').insert({
        teacher_id: classRow.teacher_id, student_id: userId, class_id: classRow.id
      });
      if (enrollmentError) {
        await admin.from('students').delete().eq('id', userId);
        await admin.auth.admin.deleteUser(userId);
        return json({ error: enrollmentError.message }, 400);
      }

      const { data: loginData, error: loginError } = await publicClient.auth.signInWithPassword({ email, password: pin });
      if (loginError || !loginData.session) {
        return json({ error: loginError?.message ?? 'Account created but login session could not be created.' }, 500);
      }

      return json({ userId, session: loginData.session });
    }

    if (action === 'login') {
      const { data: student, error: studentError } = await admin
        .from('students')
        .select('id')
        .eq('samagra_id', samagraId)
        .maybeSingle();
      if (studentError) return json({ error: studentError.message }, 500);
      if (!student) return json({ error: 'Invalid Student ID or PIN.' }, 401);

      const { data: loginData, error: loginError } = await publicClient.auth.signInWithPassword({ email, password: pin });
      if (loginError || !loginData.session) return json({ error: 'Invalid Student ID or PIN.' }, 401);

      return json({ userId: student.id, session: loginData.session });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected server error.' }, 500);
  }
});
