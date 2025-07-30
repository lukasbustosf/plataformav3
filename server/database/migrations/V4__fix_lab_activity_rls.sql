-- V4: Fix Row Level Security policy for lab_activity table

BEGIN;

-- Drop the old, overly restrictive select policy
DROP POLICY IF EXISTS p_lab_activity_select ON public.lab_activity;

-- Create a new, simpler policy.
-- The API route is already protected by `authenticateToken`, so we just need to
-- ensure that any authenticated user can read active activities.
CREATE POLICY "Allow authenticated users to read active activities"
ON public.lab_activity
FOR SELECT
USING (
  status = 'active' AND
  auth.uid() IS NOT NULL -- Checks if the user has a valid session (is authenticated)
);

COMMIT;
