-- Update sweets with themed fairy-tale names and detailed descriptions
UPDATE public.sweets SET 
  name = 'Night in the Fairy Garden',
  description = 'On a light biscuit base, Philadelphia cream cheese, blueberry curls and blueberries. A magical blend of dreamy flavors under moonlight.',
  category = 'Cakes',
  price = 450.00
WHERE name = 'Red Velvet Cake';

UPDATE public.sweets SET 
  name = 'Whispers of Velvet Dreams',
  description = 'Rich dark chocolate truffles infused with essence of midnight, wrapped in a velvety smooth center that melts like secrets on your tongue.',
  category = 'Chocolates',
  price = 89.50
WHERE name = 'Chocolate Truffles';

UPDATE public.sweets SET 
  name = 'Rose Petal Serenade',
  description = 'Delicate French macarons kissed with fresh strawberry and rose essence, as light as a butterfly\'s whisper.',
  category = 'Macarons',
  price = 125.00
WHERE name = 'Strawberry Macarons';

UPDATE public.sweets SET 
  name = 'Golden Amber Symphony',
  description = 'Handcrafted caramel fudge made with real butter and a touch of sea salt, reminiscent of golden sunsets over honey fields.',
  category = 'Fudge',
  price = 67.00
WHERE name = 'Caramel Fudge';

UPDATE public.sweets SET 
  name = 'Rainbow Enchantment',
  description = 'Assorted fruity gummy bears dancing with flavors from enchanted orchards, each bite a new adventure.',
  category = 'Gummies',
  price = 45.00
WHERE name = 'Mixed Gummy Bears';

UPDATE public.sweets SET 
  name = 'Cloud Nine Vanilla',
  description = 'Classic vanilla cupcakes crowned with buttercream frosting, as fluffy as clouds in a summer sky.',
  category = 'Cupcakes',
  price = 95.00
WHERE name = 'Vanilla Cupcakes';

UPDATE public.sweets SET 
  name = 'Sunshine Citrus Delight',
  description = 'Tangy lemon tarts with a buttery crust, capturing the essence of Mediterranean sunshine in every bite.',
  category = 'Pastries',
  price = 78.00
WHERE name = 'Lemon Tarts';

UPDATE public.sweets SET 
  name = 'Twilight Mint Mystery',
  description = 'Refreshing mint chocolate squares that melt on your tongue like cool breezes on a summer twilight evening.',
  category = 'Chocolates',
  price = 72.00
WHERE name = 'Mint Chocolates';

UPDATE public.sweets SET 
  name = 'Berry Bliss Reverie',
  description = 'Creamy cheesecake topped with fresh raspberries, a symphony of tangy sweetness that dances on your palate.',
  category = 'Cakes',
  price = 380.00
WHERE name = 'Raspberry Cheesecake';

UPDATE public.sweets SET 
  name = 'Crunchy Caramel Cosmos',
  description = 'Crunchy peanut brittle with perfectly roasted peanuts, scattered like stars in a caramel galaxy.',
  category = 'Brittle',
  price = 54.00
WHERE name = 'Peanut Brittle';
