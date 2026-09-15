-- Stoway database schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query)

-- 1. Listings table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  host_name text not null,
  title jsonb not null,
  description jsonb not null,
  neighbourhood text not null,
  type text not null check (type in ('cellar', 'garage', 'storage', 'parking')),
  size int not null,
  price int not null,
  photos text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.listings enable row level security;

create policy "Listings are viewable by everyone"
  on public.listings for select
  using (true);

create policy "Authenticated users can insert their own listings"
  on public.listings for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Users can update their own listings"
  on public.listings for update
  to authenticated
  using (auth.uid() = owner_id);

create policy "Users can delete their own listings"
  on public.listings for delete
  to authenticated
  using (auth.uid() = owner_id);

-- 2. Storage bucket for listing photos
insert into storage.buckets (id, name, public)
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

create policy "Public read access to listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "Authenticated users can upload listing photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-photos');

create policy "Users can delete their own listing photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-photos' and owner = auth.uid());

-- 3. Seed data: the original 8 sample listings
-- Uses $j$...$j$ dollar-quoting for the JSON text so apostrophes in
-- Italian/French text (e.g. "d'epoca", "l'année") don't need escaping.
insert into public.listings (owner_id, host_name, title, description, neighbourhood, type, size, price, photos)
values
  (null, 'Mariana',
   $j${"en":"Dry cellar room near Sé Catedral","pt":"Cave seca perto da Sé Catedral","de":"Trockener Kellerraum nahe Sé Catedral","it":"Cantina asciutta vicino alla Sé Catedral","fr":"Cave sèche près de la Sé Catedral"}$j$,
   $j${"en":"Quiet, dry cellar room on the ground floor of an old building. Great for furniture, boxes or seasonal items. Level access via the courtyard.","pt":"Cave seca e sossegada no rés-do-chão de um prédio antigo. Ótima para móveis, caixas ou artigos sazonais. Acesso direto pelo pátio.","de":"Ruhiger, trockener Kellerraum im Erdgeschoss eines Altbaus. Ideal für Möbel, Kisten oder Saisonware. Ebenerdiger Zugang über den Innenhof.","it":"Cantina tranquilla e asciutta al piano terra di un edificio d'epoca. Ideale per mobili, scatole o articoli stagionali. Accesso in piano dal cortile.","fr":"Cave calme et sèche au rez-de-chaussée d'un bâtiment ancien. Idéale pour meubles, cartons ou articles saisonniers. Accès de plain-pied par la cour."}$j$,
   'Alfama', 'cellar', 8, 45, '{}'),

  (null, 'João',
   $j${"en":"Garage spot with roller door","pt":"Garagem com portão basculante","de":"Garagenstellplatz mit Rolltor","it":"Garage con serranda elettrica","fr":"Garage avec porte basculante"}$j$,
   $j${"en":"Lockable garage with electric roller door, accessible year-round. Room for a bike, tools or moving boxes.","pt":"Garagem fechada com portão elétrico, acessível todo o ano. Espaço para bicicleta, ferramentas ou caixas de mudança.","de":"Abschließbare Garage mit elektrischem Rolltor, ganzjährig zugänglich. Platz für Fahrrad, Werkzeug oder Umzugskartons.","it":"Garage chiudibile a chiave con serranda elettrica, accessibile tutto l'anno. Spazio per bici, attrezzi o scatoloni per il trasloco.","fr":"Garage fermant à clé avec porte basculante électrique, accessible toute l'année. De la place pour un vélo, des outils ou des cartons de déménagement."}$j$,
   'Belém', 'garage', 15, 80, '{}'),

  (null, 'Sofia',
   $j${"en":"Basement storage room, CCTV monitored","pt":"Arrecadação na cave, com videovigilância","de":"Lagerraum im Souterrain, videoüberwacht","it":"Ripostiglio nel seminterrato, con videosorveglianza","fr":"Espace de stockage en sous-sol, sous vidéosurveillance"}$j$,
   $j${"en":"Secure storage room with CCTV and your own key. Centrally located, accessible around the clock.","pt":"Arrecadação segura com videovigilância e chave própria. Localização central, acesso 24 horas.","de":"Sicherer Lagerraum mit Videoüberwachung und eigenem Schlüssel. Zentral gelegen, Zugang rund um die Uhr möglich.","it":"Ripostiglio sicuro con videosorveglianza e chiave personale. Posizione centrale, accessibile 24 ore su 24.","fr":"Espace de stockage sécurisé avec vidéosurveillance et clé personnelle. Emplacement central, accessible 24h/24."}$j$,
   'Baixa', 'storage', 12, 60, '{}'),

  (null, 'Pedro',
   $j${"en":"Parking spot with extra storage","pt":"Lugar de estacionamento com arrumação extra","de":"Parkplatz mit Zusatzstauraum","it":"Posto auto con spazio extra","fr":"Place de parking avec rangement supplémentaire"}$j$,
   $j${"en":"Private outdoor parking spot with a small lockable cabinet on the side for extra luggage or tyres.","pt":"Lugar de estacionamento privado ao ar livre, com um pequeno armário fechado à parte para bagagem ou pneus.","de":"Privater Außenstellplatz mit kleinem, abschließbarem Schrank an der Seite für zusätzliches Gepäck oder Reifen.","it":"Posto auto privato all'aperto con un piccolo armadietto chiudibile a lato per bagagli extra o pneumatici.","fr":"Place de parking privée extérieure avec un petit placard verrouillable sur le côté pour bagages ou pneus supplémentaires."}$j$,
   'Chiado', 'parking', 10, 70, '{}'),

  (null, 'Beatriz',
   $j${"en":"Spacious cellar with shelving","pt":"Cave espaçosa com prateleiras","de":"Geräumiger Keller mit Regalen","it":"Cantina spaziosa con scaffalature","fr":"Cave spacieuse avec étagères"}$j$,
   $j${"en":"Large cellar room already fitted with sturdy metal shelving. Perfect for long-term storage.","pt":"Cave grande já equipada com prateleiras metálicas resistentes. Perfeita para armazenamento de longa duração.","de":"Großer Kellerraum, bereits mit stabilen Metallregalen ausgestattet. Perfekt für Langzeit-Einlagerung.","it":"Ampia cantina già dotata di solide scaffalature in metallo. Perfetta per il deposito a lungo termine.","fr":"Grande cave déjà équipée d'étagères métalliques robustes. Parfaite pour un stockage de longue durée."}$j$,
   'Graça', 'cellar', 20, 95, '{}'),

  (null, 'Carlos',
   $j${"en":"Double garage, dividable","pt":"Garagem dupla, divisível","de":"Doppelgarage, teilbar","it":"Garage doppio, divisibile","fr":"Garage double, divisible"}$j$,
   $j${"en":"Large double garage, can be split with a partition on request. Fits furniture from a whole house move or a car plus storage.","pt":"Garagem dupla grande, divisível com uma mamparra a pedido. Cabe a mobília de uma mudança inteira ou um carro mais arrumação.","de":"Große Doppelgarage, auf Wunsch mit Trennwand teilbar. Geeignet für Möbel eines ganzen Umzugs oder ein Fahrzeug plus Stauraum.","it":"Ampio garage doppio, divisibile con una parete a richiesta. Adatto ai mobili di un intero trasloco o a un'auto più spazio di deposito.","fr":"Grand garage double, divisible avec une cloison sur demande. Convient aux meubles d'un déménagement complet ou à une voiture plus du rangement."}$j$,
   'Campo de Ourique', 'garage', 28, 120, '{}'),

  (null, 'Inês',
   $j${"en":"Small storage nook in the courtyard","pt":"Pequena arrecadação no pátio","de":"Kleiner Verschlag im Innenhof","it":"Piccolo ripostiglio nel cortile","fr":"Petit espace de stockage dans la cour"}$j$,
   $j${"en":"Compact, dry storage nook in the shared courtyard. Great for boxes, suitcases or bicycles.","pt":"Arrecadação compacta e seca no pátio comum. Ótima para caixas, malas ou bicicletas.","de":"Kompakter, trockener Verschlag im gemeinsamen Innenhof. Ideal für Kartons, Koffer oder Fahrräder.","it":"Ripostiglio compatto e asciutto nel cortile condominiale. Ideale per scatole, valigie o biciclette.","fr":"Petit espace sec et compact dans la cour commune. Idéal pour des cartons, valises ou vélos."}$j$,
   'Arroios', 'storage', 5, 30, '{}'),

  (null, 'Rui',
   $j${"en":"Parking spot near Oriente metro","pt":"Lugar de estacionamento perto do metro Oriente","de":"Stellplatz nahe Metro Oriente","it":"Posto auto vicino alla metro Oriente","fr":"Place de parking près du métro Oriente"}$j$,
   $j${"en":"Covered parking spot in an underground garage, walking distance to the metro. Accessible 24/7 with a keycard.","pt":"Lugar coberto numa garagem subterrânea, a poucos passos do metro. Acesso 24 horas com cartão.","de":"Überdachter Stellplatz in Tiefgarage, fußläufig zur Metro. Rund um die Uhr per Chipkarte erreichbar.","it":"Posto auto coperto in garage sotterraneo, a pochi passi dalla metro. Accessibile 24 ore su 24 con tessera magnetica.","fr":"Place de parking couverte dans un parking souterrain, à quelques pas du métro. Accessible 24h/24 avec un badge."}$j$,
   'Parque das Nações', 'parking', 12, 65, '{}');
