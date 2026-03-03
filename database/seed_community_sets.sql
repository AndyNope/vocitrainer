-- Compact Advanced C1 - Community Sets
-- Hinweis: Bitte USER_ID anpassen.

SET @USER_ID := 2;

-- 1. Breaking news
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Breaking News', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'news'), 256));
SET @SET_1 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_1, 'headline', 'Schlagzeile', 1),
(@SET_1, 'breaking news', 'aktuelle Eilmeldung', 2),
(@SET_1, 'coverage', 'Berichterstattung', 3),
(@SET_1, 'correspondent', 'Korrespondent/in', 4),
(@SET_1, 'to broadcast', 'senden, ausstrahlen', 5),
(@SET_1, 'breaking story', 'aktuelle Nachricht', 6),
(@SET_1, 'press conference', 'Pressekonferenz', 7),
(@SET_1, 'media outlet', 'Medienunternehmen', 8),
(@SET_1, 'to leak', 'durchsickern lassen', 9),
(@SET_1, 'exclusive', 'Exklusivmeldung', 10),
(@SET_1, 'investigative journalism', 'Investigativjournalismus', 11),
(@SET_1, 'to verify', 'überprüfen, verifizieren', 12),
(@SET_1, 'source', 'Quelle', 13),
(@SET_1, 'eyewitness', 'Augenzeuge/-zeugin', 14),
(@SET_1, 'to unfold', 'sich entwickeln, entfalten', 15),
(@SET_1, 'credibility', 'Glaubwürdigkeit', 16),
(@SET_1, 'bias', 'Voreingenommenheit', 17),
(@SET_1, 'to circulate', 'kursieren, verbreiten', 18),
(@SET_1, 'to fabricate', 'erfinden, fälschen', 19),
(@SET_1, 'sensationalism', 'Sensationsgier', 20);

-- 2. Travels and traditions
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Travels and Traditions', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'travel'), 256));
SET @SET_2 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_2, 'off the beaten track', 'abseits ausgetretener Pfade', 1),
(@SET_2, 'indigenous', 'einheimisch, indigen', 2),
(@SET_2, 'heritage', 'Erbe, Kulturerbe', 3),
(@SET_2, 'customs', 'Bräuche, Sitten', 4),
(@SET_2, 'to immerse oneself', 'sich vertiefen, eintauchen', 5),
(@SET_2, 'wanderlust', 'Fernweh, Reiselust', 6),
(@SET_2, 'itinerary', 'Reiseroute, Reiseplan', 7),
(@SET_2, 'to venture', 'sich wagen', 8),
(@SET_2, 'exotic', 'exotisch', 9),
(@SET_2, 'ritual', 'Ritual, Brauch', 10),
(@SET_2, 'pilgrimage', 'Pilgerreise', 11),
(@SET_2, 'folklore', 'Folklore, Volkskunde', 12),
(@SET_2, 'to cherish', 'schätzen, hegen', 13),
(@SET_2, 'nomadic', 'nomadisch', 14),
(@SET_2, 'to uphold traditions', 'Traditionen bewahren', 15),
(@SET_2, 'ancestral', 'angestammt, Ahnen-', 16),
(@SET_2, 'cosmopolitan', 'weltoffen, kosmopolitisch', 17),
(@SET_2, 'cultural exchange', 'Kulturaustausch', 18),
(@SET_2, 'to assimilate', 'sich anpassen, assimilieren', 19),
(@SET_2, 'authenticity', 'Authentizität', 20);

-- 3. Behaving and interacting
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Behaving and Interacting', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'behave'), 256));
SET @SET_3 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_3, 'etiquette', 'Etikette, Umgangsformen', 1),
(@SET_3, 'to empathize', 'mitfühlen, sich einfühlen', 2),
(@SET_3, 'rapport', 'gutes Verhältnis, Beziehung', 3),
(@SET_3, 'tactful', 'taktvoll', 4),
(@SET_3, 'to offend', 'beleidigen, kränken', 5),
(@SET_3, 'confrontational', 'konfrontativ', 6),
(@SET_3, 'to reconcile', 'versöhnen, in Einklang bringen', 7),
(@SET_3, 'courtesy', 'Höflichkeit, Zuvorkommenheit', 8),
(@SET_3, 'assertive', 'selbstbewusst, bestimmt', 9),
(@SET_3, 'diplomatic', 'diplomatisch', 10),
(@SET_3, 'condescending', 'herablassend', 11),
(@SET_3, 'to patronize', 'bevormunden, gönnerhaft behandeln', 12),
(@SET_3, 'body language', 'Körpersprache', 13),
(@SET_3, 'interpersonal skills', 'zwischenmenschliche Fähigkeiten', 14),
(@SET_3, 'to alienate', 'entfremden, abschrecken', 15),
(@SET_3, 'peer pressure', 'Gruppenzwang', 16),
(@SET_3, 'to conform', 'sich anpassen, entsprechen', 17),
(@SET_3, 'gregarious', 'gesellig, kontaktfreudig', 18),
(@SET_3, 'introvert', 'introvertiert', 19),
(@SET_3, 'charisma', 'Charisma, Ausstrahlung', 20);

-- 4. Selling and spending
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Selling and Spending', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'selling'), 256));
SET @SET_4 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_4, 'consumerism', 'Konsumdenken', 1),
(@SET_4, 'marketing strategy', 'Marketingstrategie', 2),
(@SET_4, 'brand loyalty', 'Markentreue', 3),
(@SET_4, 'disposable income', 'verfügbares Einkommen', 4),
(@SET_4, 'impulse buying', 'Impulskauf', 5),
(@SET_4, 'bargain', 'Schnäppchen, Sonderangebot', 6),
(@SET_4, 'recession', 'Rezession, Wirtschaftsflaute', 7),
(@SET_4, 'to splurge', 'sich etwas gönnen, Geld ausgeben', 8),
(@SET_4, 'thrifty', 'sparsam, haushälterisch', 9),
(@SET_4, 'to haggle', 'feilschen, handeln', 10),
(@SET_4, 'profit margin', 'Gewinnspanne', 11),
(@SET_4, 'target audience', 'Zielgruppe', 12),
(@SET_4, 'to launch a product', 'ein Produkt auf den Markt bringen', 13),
(@SET_4, 'retail', 'Einzelhandel', 14),
(@SET_4, 'supply and demand', 'Angebot und Nachfrage', 15),
(@SET_4, 'inflation', 'Inflation', 16),
(@SET_4, 'purchasing power', 'Kaufkraft', 17),
(@SET_4, 'market saturation', 'Marktsättigung', 18),
(@SET_4, 'advertisement', 'Werbung, Anzeige', 19),
(@SET_4, 'to endorse', 'befürworten, unterstützen', 20);

-- 5. Health and sport
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Health and Sport', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'health'), 256));
SET @SET_5 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_5, 'stamina', 'Ausdauer, Durchhaltevermögen', 1),
(@SET_5, 'nutrition', 'Ernährung', 2),
(@SET_5, 'cardiovascular', 'kardiovaskulär, Herz-Kreislauf-', 3),
(@SET_5, 'immunity', 'Immunität, Abwehrkraft', 4),
(@SET_5, 'to rehabilitate', 'rehabilitieren, wiederherstellen', 5),
(@SET_5, 'chronic illness', 'chronische Krankheit', 6),
(@SET_5, 'well-being', 'Wohlbefinden', 7),
(@SET_5, 'sedentary lifestyle', 'sitzende Lebensweise', 8),
(@SET_5, 'to diagnose', 'diagnostizieren', 9),
(@SET_5, 'strenuous', 'anstrengend, kräftezehrend', 10),
(@SET_5, 'endurance', 'Ausdauer, Belastbarkeit', 11),
(@SET_5, 'metabolism', 'Stoffwechsel', 12),
(@SET_5, 'fitness regime', 'Fitnessprogramm', 13),
(@SET_5, 'to alleviate', 'lindern, mildern', 14),
(@SET_5, 'preventive care', 'Vorsorge, Prävention', 15),
(@SET_5, 'rigorous training', 'strenges Training', 16),
(@SET_5, 'mental health', 'psychische Gesundheit', 17),
(@SET_5, 'wellness', 'Wellness, Gesundheit', 18),
(@SET_5, 'epidemic', 'Epidemie', 19),
(@SET_5, 'to excel', 'sich auszeichnen, hervorragen', 20);

-- 6. Culture old and new
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Culture Old and New', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'culture'), 256));
SET @SET_6 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_6, 'renaissance', 'Renaissance', 1),
(@SET_6, 'masterpiece', 'Meisterwerk', 2),
(@SET_6, 'contemporary art', 'zeitgenössische Kunst', 3),
(@SET_6, 'artifact', 'Artefakt, Gegenstand', 4),
(@SET_6, 'preservation', 'Erhaltung, Bewahrung', 5),
(@SET_6, 'avant-garde', 'Avantgarde', 6),
(@SET_6, 'legacy', 'Vermächtnis, Erbe', 7),
(@SET_6, 'curator', 'Kurator/in', 8),
(@SET_6, 'exhibition', 'Ausstellung', 9),
(@SET_6, 'aesthetic', 'ästhetisch, Ästhetik', 10),
(@SET_6, 'to depict', 'darstellen, abbilden', 11),
(@SET_6, 'mural', 'Wandgemälde', 12),
(@SET_6, 'installation', 'Installation (Kunst)', 13),
(@SET_6, 'monumental', 'monumental, gewaltig', 14),
(@SET_6, 'craftsmanship', 'Handwerkskunst', 15),
(@SET_6, 'symbolism', 'Symbolik', 16),
(@SET_6, 'to critique', 'kritisieren, Kritik üben', 17),
(@SET_6, 'cultural landmark', 'kulturelles Wahrzeichen', 18),
(@SET_6, 'to revive', 'wiederbeleben, neu aufleben lassen', 19),
(@SET_6, 'intellectual property', 'geistiges Eigentum', 20);

-- 7. Green issues
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Green Issues', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'green'), 256));
SET @SET_7 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_7, 'sustainability', 'Nachhaltigkeit', 1),
(@SET_7, 'carbon footprint', 'CO2-Fußabdruck', 2),
(@SET_7, 'renewable energy', 'erneuerbare Energie', 3),
(@SET_7, 'deforestation', 'Abholzung, Entwaldung', 4),
(@SET_7, 'biodiversity', 'Artenvielfalt, Biodiversität', 5),
(@SET_7, 'greenhouse effect', 'Treibhauseffekt', 6),
(@SET_7, 'to deplete', 'erschöpfen, verbrauchen', 7),
(@SET_7, 'ecosystem', 'Ökosystem', 8),
(@SET_7, 'pollution', 'Verschmutzung, Umweltverschmutzung', 9),
(@SET_7, 'endangered species', 'bedrohte Art', 10),
(@SET_7, 'conservation', 'Naturschutz, Erhaltung', 11),
(@SET_7, 'climate change', 'Klimawandel', 12),
(@SET_7, 'to recycle', 'recyceln, wiederverwerten', 13),
(@SET_7, 'ecological', 'ökologisch', 14),
(@SET_7, 'fossil fuels', 'fossile Brennstoffe', 15),
(@SET_7, 'ozone layer', 'Ozonschicht', 16),
(@SET_7, 'sustainable development', 'nachhaltige Entwicklung', 17),
(@SET_7, 'to mitigate', 'abschwächen, mildern', 18),
(@SET_7, 'carbon emissions', 'Kohlenstoffemissionen', 19),
(@SET_7, 'environmental degradation', 'Umweltzerstörung', 20);

-- 8. Learning and working
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Learning and Working', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'work'), 256));
SET @SET_8 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_8, 'vocational training', 'Berufsausbildung', 1),
(@SET_8, 'apprenticeship', 'Lehre, Ausbildung', 2),
(@SET_8, 'curriculum', 'Lehrplan', 3),
(@SET_8, 'academia', 'akademische Welt', 4),
(@SET_8, 'to mentor', 'betreuen, anleiten', 5),
(@SET_8, 'career prospects', 'Karriereaussichten', 6),
(@SET_8, 'professional development', 'berufliche Entwicklung', 7),
(@SET_8, 'to upskill', 'sich weiterqualifizieren', 8),
(@SET_8, 'work-life balance', 'Work-Life-Balance', 9),
(@SET_8, 'entrepreneurship', 'Unternehmertum', 10),
(@SET_8, 'redundancy', 'Entlassung, Überflüssigkeit', 11),
(@SET_8, 'to delegate', 'delegieren, übertragen', 12),
(@SET_8, 'competence', 'Kompetenz, Fähigkeit', 13),
(@SET_8, 'collaborative', 'zusammenarbeitend, kooperativ', 14),
(@SET_8, 'initiative', 'Initiative, Eigeninitiative', 15),
(@SET_8, 'tenure', 'Festanstellung, Amtszeit', 16),
(@SET_8, 'to specialize', 'sich spezialisieren', 17),
(@SET_8, 'scholarship', 'Stipendium, Gelehrsamkeit', 18),
(@SET_8, 'to advance', 'vorankommen, aufsteigen', 19),
(@SET_8, 'lifelong learning', 'lebenslanges Lernen', 20);

-- 9. Science and technology
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: Science and Technology', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'science'), 256));
SET @SET_9 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_9, 'breakthrough', 'Durchbruch', 1),
(@SET_9, 'innovation', 'Innovation, Neuerung', 2),
(@SET_9, 'artificial intelligence', 'künstliche Intelligenz', 3),
(@SET_9, 'to revolutionize', 'revolutionieren', 4),
(@SET_9, 'cutting-edge', 'hochmodern, wegweisend', 5),
(@SET_9, 'nanotechnology', 'Nanotechnologie', 6),
(@SET_9, 'hypothesis', 'Hypothese', 7),
(@SET_9, 'to conduct research', 'Forschung betreiben', 8),
(@SET_9, 'laboratory', 'Labor', 9),
(@SET_9, 'genetic engineering', 'Gentechnik', 10),
(@SET_9, 'to pioneer', 'Pionierarbeit leisten', 11),
(@SET_9, 'algorithm', 'Algorithmus', 12),
(@SET_9, 'automation', 'Automatisierung', 13),
(@SET_9, 'prototype', 'Prototyp', 14),
(@SET_9, 'cyber security', 'Cybersicherheit', 15),
(@SET_9, 'data analysis', 'Datenanalyse', 16),
(@SET_9, 'quantum physics', 'Quantenphysik', 17),
(@SET_9, 'ethical implications', 'ethische Auswirkungen', 18),
(@SET_9, 'to patent', 'patentieren', 19),
(@SET_9, 'obsolete', 'veraltet, überholt', 20);

-- 10. A mind of one's own
INSERT INTO voci_sets (user_id, name, language_id, is_shared, is_community, share_token) VALUES
(@USER_ID, 'C1: A Mind of One\'s Own', (SELECT id FROM languages WHERE code='en' LIMIT 1), 1, 1, SHA2(CONCAT(UUID(), 'mind'), 256));
SET @SET_10 := LAST_INSERT_ID();
INSERT INTO vocabularies (set_id, word_main, word_target, position) VALUES
(@SET_10, 'cognitive', 'kognitiv, erkenntnismäßig', 1),
(@SET_10, 'perception', 'Wahrnehmung', 2),
(@SET_10, 'subconscious', 'Unterbewusstsein', 3),
(@SET_10, 'introspection', 'Selbstbeobachtung, Introspektion', 4),
(@SET_10, 'rational', 'rational, vernünftig', 5),
(@SET_10, 'intuition', 'Intuition, Bauchgefühl', 6),
(@SET_10, 'prejudice', 'Vorurteil', 7),
(@SET_10, 'skeptical', 'skeptisch', 8),
(@SET_10, 'conviction', 'Überzeugung', 9),
(@SET_10, 'to contemplate', 'nachdenken, erwägen', 10),
(@SET_10, 'mindset', 'Denkweise, Einstellung', 11),
(@SET_10, 'autonomy', 'Autonomie, Selbstständigkeit', 12),
(@SET_10, 'to ponder', 'grübeln, nachsinnen', 13),
(@SET_10, 'resilience', 'Widerstandsfähigkeit', 14),
(@SET_10, 'to deliberate', 'überlegen, beraten', 15),
(@SET_10, 'open-minded', 'aufgeschlossen', 16),
(@SET_10, 'stubbornness', 'Sturheit, Eigensinn', 17),
(@SET_10, 'self-awareness', 'Selbstbewusstsein', 18),
(@SET_10, 'ideology', 'Ideologie, Weltanschauung', 19),
(@SET_10, 'to reason', 'argumentieren, folgern', 20);
