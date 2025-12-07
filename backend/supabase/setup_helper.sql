-- First, execute this helper function in Supabase SQL Editor
-- This will allow us to execute SQL via RPC calls

CREATE OR REPLACE FUNCTION public.execute_sql(sql_query TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    EXECUTE sql_query;
    RETURN json_build_object('success', true, 'message', 'SQL executed successfully');
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
