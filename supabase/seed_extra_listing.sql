-- One extra demo listing so the grid/map look populated with more than 2 items.
insert into public.listings (owner_id, host_name, title, description, neighbourhood, type, size, price, photos)
values
  (null, 'Miguel',
   $j${"en":"Secure garage near Chiado","pt":"Garagem segura perto do Chiado","de":"Sichere Garage nahe Chiado","it":"Garage sicuro vicino al Chiado","fr":"Garage sécurisé près de Chiado"}$j$,
   $j${"en":"Underground garage spot in a gated building, accessible with a remote. Great for a car, motorbike, or extra storage.","pt":"Lugar de garagem subterrânea num prédio fechado, com acesso por comando. Ótimo para carro, mota ou arrumação extra.","de":"Tiefgaragenstellplatz in einem abgeschlossenen Gebäude, per Fernbedienung zugänglich. Ideal für Auto, Motorrad oder zusätzlichen Stauraum.","it":"Posto in garage sotterraneo in un edificio recintato, accessibile con telecomando. Ottimo per auto, moto o spazio extra.","fr":"Place de garage souterraine dans un immeuble fermé, accessible par télécommande. Idéale pour une voiture, une moto ou du rangement supplémentaire."}$j$,
   'Chiado', 'garage', 14, 75, '{}');
