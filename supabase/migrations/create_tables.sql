/*
  # Create initial schema for Duolingcards

  1. New Tables
    - `decks`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `language` (text, not null)
      - `description` (text)
      - `user_id` (uuid, not null, references auth.users)
      - `created_at` (timestamptz, default now())
    - `cards`
      - `id` (uuid, primary key)
      - `target_word` (text, not null)
      - `translation` (text, not null)
      - `language` (text, not null)
      - `deck_id` (uuid, not null, references decks)
      - `known` (boolean, default false)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create decks table
CREATE TABLE IF NOT EXISTS decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  language text NOT NULL,
  description text,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_word text NOT NULL,
  translation text NOT NULL,
  language text NOT NULL,
  deck_id uuid NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  known boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Create policies for decks
CREATE POLICY "Users can create their own decks"
  ON decks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own decks"
  ON decks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks"
  ON decks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks"
  ON decks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for cards
CREATE POLICY "Users can create cards in their decks"
  ON cards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_id
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view cards in their decks"
  ON cards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_id
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cards in their decks"
  ON cards
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_id
      AND decks.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_id
      AND decks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cards in their decks"
  ON cards
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_id
      AND decks.user_id = auth.uid()
    )
  );