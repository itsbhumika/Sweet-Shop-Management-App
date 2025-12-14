-- Add image_url column to sweets table
ALTER TABLE public.sweets ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update sweets with image URLs for each category
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Chocolate Truffles';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Strawberry Macarons';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Caramel Fudge';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Mixed Gummy Bears';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Vanilla Cupcakes';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Lemon Tarts';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Peanut Brittle';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Red Velvet Cake';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Mint Chocolates';
UPDATE public.sweets SET image_url = '/placeholder.svg?height=400&width=400' WHERE name = 'Raspberry Cheesecake';
