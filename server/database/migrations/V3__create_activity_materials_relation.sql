-- V3: Create lab_activity_materials join table for many-to-many relationship (Corrected Types)

BEGIN;

-- 1. Create the join table
CREATE TABLE IF NOT EXISTS public.lab_activity_materials (
    activity_id UUID NOT NULL REFERENCES public.lab_activity(id) ON DELETE CASCADE,
    material_id INTEGER NOT NULL REFERENCES public.lab_material(id) ON DELETE CASCADE, -- Corrected type to INTEGER
    quantity_required INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (activity_id, material_id)
);

-- Add comments to the new table and columns for clarity
COMMENT ON TABLE public.lab_activity_materials IS 'Join table to link activities with their required materials, establishing a many-to-many relationship.';
COMMENT ON COLUMN public.lab_activity_materials.activity_id IS 'Foreign key to the lab_activity table.';
COMMENT ON COLUMN public.lab_activity_materials.material_id IS 'Foreign key to the lab_material table.';
COMMENT ON COLUMN public.lab_activity_materials.quantity_required IS 'How many units of this material are required for the activity.';
COMMENT ON COLUMN public.lab_activity_materials.notes IS 'Optional notes about the use of this material in this specific activity (e.g., "Use the red ones").';


-- 2. Create a trigger to automatically update the updated_at timestamp
-- This assumes the function trigger_set_updated_at() already exists from a previous migration.
-- If not, you should create it first.
CREATE OR REPLACE TRIGGER set_updated_at_timestamp
BEFORE UPDATE ON public.lab_activity_materials
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_updated_at();

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.lab_activity_materials ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Allow public read access
CREATE POLICY "Allow public read-only access"
ON public.lab_activity_materials
FOR SELECT
USING (true);

-- Allow superadmins to manage all records
CREATE POLICY "Allow superadmin full access"
ON public.lab_activity_materials
FOR ALL
USING (public.is_superadmin())
WITH CHECK (public.is_superadmin());

-- Allow authors to manage their activity materials
CREATE POLICY "Allow authors to manage their activity materials"
ON public.lab_activity_materials
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.lab_activity WHERE id = activity_id AND author_id = auth.uid())
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.lab_activity WHERE id = activity_id AND author_id = auth.uid())
);


-- 5. (Optional but Recommended) Data Migration Script
CREATE OR REPLACE FUNCTION public.migrate_required_materials_to_join_table()
RETURNS VOID AS $
DECLARE
    activity_record RECORD;
    material_id_int INTEGER;
BEGIN
    RAISE NOTICE 'Starting migration of required_material_ids...';
    FOR activity_record IN SELECT id, required_material_ids FROM public.lab_activity WHERE required_material_ids IS NOT NULL AND array_length(required_material_ids, 1) > 0 LOOP
        RAISE NOTICE 'Processing activity ID: %', activity_record.id;
        FOREACH material_id_int IN ARRAY activity_record.required_material_ids LOOP
            BEGIN
                -- Insert into the new join table, ignoring duplicates
                INSERT INTO public.lab_activity_materials (activity_id, material_id)
                VALUES (activity_record.id, material_id_int)
                ON CONFLICT (activity_id, material_id) DO NOTHING;
                
                RAISE NOTICE '  -> Linked material ID: %', material_id_int;
            EXCEPTION
                WHEN others THEN
                    RAISE WARNING 'An error occurred for material_id % and activity_id %: %', material_id_int, activity_record.id, SQLERRM;
            END;
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Migration complete.';
END;
$ LANGUAGE plpgsql;

-- Note: To run the migration, execute `SELECT public.migrate_required_materials_to_join_table();`
-- After migration, you might consider dropping the `required_material_ids` column from `lab_activity`.
-- ALTER TABLE public.lab_activity DROP COLUMN IF EXISTS required_material_ids;

COMMIT;
