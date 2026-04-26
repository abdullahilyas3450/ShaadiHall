-- Enable btree_gist extension for overlap constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- USERS Table Policies
-- SELECT own row only
CREATE POLICY select_own_user ON users
FOR SELECT USING (auth.uid() = id);

-- UPDATE own row only
CREATE POLICY update_own_user ON users
FOR UPDATE USING (auth.uid() = id);

-- HALLS Table Policies
-- SELECT allowed for all authenticated users
CREATE POLICY select_all_halls ON halls
FOR SELECT USING (TRUE);

-- INSERT/UPDATE/DELETE only for admin role
CREATE POLICY admin_manage_halls ON halls
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- BOOKINGS Table Policies
-- SELECT/INSERT own rows
CREATE POLICY user_manage_own_bookings ON bookings
FOR ALL USING (
    user_id = auth.uid()
) WITH CHECK (
    user_id = auth.uid()
);

-- Admin can SELECT/UPDATE all rows
CREATE POLICY admin_manage_all_bookings ON bookings
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);

-- ADMINS Table Policies
CREATE POLICY admin_manage_admins ON admins
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid() AND users.role = 'admin'
    )
);
