-- Drop problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all sweets" ON public.sweets;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can insert sweets" ON public.sweets;
DROP POLICY IF EXISTS "Admins can update sweets" ON public.sweets;
DROP POLICY IF EXISTS "Admins can delete sweets" ON public.sweets;

-- Drop the old function if it exists
DROP FUNCTION IF EXISTS public.is_admin();

-- Create optimized security definer function using Supabase best practices
-- This function bypasses RLS and uses a SELECT subquery for better performance
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Recreate policies using (SELECT is_admin()) pattern for optimal caching
-- This prevents the function from being called on each row

-- Profiles - Admins can view all profiles using the safe function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING ((SELECT is_admin()));

-- Sweets - Admins can view all sweets (including unavailable ones)
CREATE POLICY "Admins can view all sweets"
  ON public.sweets FOR SELECT
  USING ((SELECT is_admin()));

-- Sweets - Admins can insert sweets
CREATE POLICY "Admins can insert sweets"
  ON public.sweets FOR INSERT
  WITH CHECK ((SELECT is_admin()));

-- Sweets - Admins can update sweets
CREATE POLICY "Admins can update sweets"
  ON public.sweets FOR UPDATE
  USING ((SELECT is_admin()));

-- Sweets - Admins can delete sweets
CREATE POLICY "Admins can delete sweets"
  ON public.sweets FOR DELETE
  USING ((SELECT is_admin()));

-- Orders - Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING ((SELECT is_admin()));

-- Orders - Admins can update all orders
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING ((SELECT is_admin()));

-- Order Items - Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING ((SELECT is_admin()));
