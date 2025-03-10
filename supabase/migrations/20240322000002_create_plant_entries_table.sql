-- Create plant_entries table for growth timeline
CREATE TABLE IF NOT EXISTS plant_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  entry_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  image_url TEXT,
  height NUMERIC,
  num_leaves INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE plant_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own plant entries" ON plant_entries;
CREATE POLICY "Users can view their own plant entries"
  ON plant_entries FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM plants
    WHERE plants.id = plant_entries.plant_id
    AND plants.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert their own plant entries" ON plant_entries;
CREATE POLICY "Users can insert their own plant entries"
  ON plant_entries FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM plants
    WHERE plants.id = plant_entries.plant_id
    AND plants.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their own plant entries" ON plant_entries;
CREATE POLICY "Users can update their own plant entries"
  ON plant_entries FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM plants
    WHERE plants.id = plant_entries.plant_id
    AND plants.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete their own plant entries" ON plant_entries;
CREATE POLICY "Users can delete their own plant entries"
  ON plant_entries FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM plants
    WHERE plants.id = plant_entries.plant_id
    AND plants.user_id = auth.uid()
  ));

-- Enable realtime
alter publication supabase_realtime add table plant_entries;
