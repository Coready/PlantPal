-- Create care_tasks table for reminders
CREATE TABLE IF NOT EXISTS care_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL, -- water, fertilize, repot, etc.
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own care tasks" ON care_tasks;
CREATE POLICY "Users can view their own care tasks"
  ON care_tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM plants
    WHERE plants.id = care_tasks.plant_id
    AND plants.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert their own care tasks" ON care_tasks;
CREATE POLICY "Users can insert their own care tasks"
  ON care_tasks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM plants
    WHERE plants.id = care_tasks.plant_id
    AND plants.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their own care tasks" ON care_tasks;
CREATE POLICY "Users can update their own care tasks"
  ON care_tasks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM plants
    WHERE plants.id = care_tasks.plant_id
    AND plants.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete their own care tasks" ON care_tasks;
CREATE POLICY "Users can delete their own care tasks"
  ON care_tasks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM plants
    WHERE plants.id = care_tasks.plant_id
    AND plants.user_id = auth.uid()
  ));

-- Enable realtime
alter publication supabase_realtime add table care_tasks;
