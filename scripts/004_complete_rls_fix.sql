-- Complete RLS Fix Script
-- This script completely fixes the infinite recursion issue by:
-- 1. Creating a security definer function that bypasses RLS
-- 2. Dropping all problematic policies
-- 3. Recreating policies with optimized queries

-- Drop the old function if it exists
DROP FUNCTION IF EXISTS public.is_admin();

-- Create optimized admin check function with security definer
-- This function bypasses RLS to check the user's role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate profiles policies without recursion
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admin policy using the security definer function wrapped in SELECT
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING ((SELECT is_admin()));

-- Drop all existing policies on sweets table
DROP POLICY IF EXISTS "Anyone can view available sweets" ON public.sweets;
DROP POLICY IF EXISTS "Admins can insert sweets" ON public.sweets;
DROP POLICY IF EXISTS "Admins can update sweets" ON public.sweets;
DROP POLICY IF EXISTS "Admins can delete sweets" ON public.sweets;
DROP POLICY IF EXISTS "Admins can view all sweets" ON public.sweets;

-- Recreate sweets policies using the optimized function
CREATE POLICY "Anyone can view available sweets"
  ON public.sweets FOR SELECT
  USING (is_available = true);

CREATE POLICY "Admins can insert sweets"
  ON public.sweets FOR INSERT
  WITH CHECK ((SELECT is_admin()));

CREATE POLICY "Admins can update sweets"
  ON public.sweets FOR UPDATE
  USING ((SELECT is_admin()));

CREATE POLICY "Admins can delete sweets"
  ON public.sweets FOR DELETE
  USING ((SELECT is_admin()));

CREATE POLICY "Admins can view all sweets"
  ON public.sweets FOR SELECT
  USING ((SELECT is_admin()));

-- Drop all existing policies on orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own pending orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

-- Recreate orders policies using the optimized function
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING ((SELECT is_admin()));

CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING ((SELECT is_admin()));

-- Drop all existing policies on order_items table
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can create order items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

-- Recreate order_items policies using the optimized function
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING ((SELECT is_admin()));
