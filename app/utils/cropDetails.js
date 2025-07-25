 
import maizeImg from '../../assets/crops/maize.jpg';
import riceImg from '../../assets/crops/rice.jpg';
import wheatImg from '../../assets/crops/wheat.jpg';
import soyabeansImg from '../../assets/crops/soyabeans.jpg';
import beansImg from '../../assets/crops/beans.jpg';
import peasImg from '../../assets/crops/peas.jpg';
import groundnutsImg from '../../assets/crops/groundnuts.jpg';
import cowpeasImg from '../../assets/crops/cowpeas.jpg';
import bananaImg from '../../assets/crops/banana.jpg';
import grapesImg from '../../assets/crops/grapes.jpg';
import watermelonImg from '../../assets/crops/watermelon.jpg';
import appleImg from '../../assets/crops/apple.jpg';
import cottonImg from '../../assets/crops/cotton.jpg';
import coconutImg from '../../assets/crops/coconut.jpg';
import mungbeanImg from '../../assets/crops/mungbean.jpg';
import mothbeansImg from '../../assets/crops/mothbeans.jpg';
import coffeeImg from "../../assets/crops/coffee.jpg";
import juteImg from "../../assets/crops/jute.jpg";
import orangeImg from "../../assets/crops/orange.png";
import blackgramImg from "../../assets/crops/blackgram.jpg";
import mangoImg from "../../assets/crops/mango.jpg";
import muskmelonImg from "../../assets/crops/muskmelon.jpg";
import papayaImg from "../../assets/crops/papaya.jpg";
import pigeonpeaImg from "../../assets/crops/pigeonpeas.jpeg";
import pomegranateImg from "../../assets/crops/pomegranate.jpg";

export const cropDetails = {
  maize: {
    title: "Maïs",
    image: maizeImg,
    description: `🌽 Le maïs est une céréale tropicale qui pousse mieux dans un sol bien drainé, riche en matière organique, avec un pH de 5,5 à 7,0. Il exige une température moyenne de 21°C à 27°C. Avant de semer, labourez bien le sol et appliquez un engrais de démarrage riche en azote. Semez les graines à une profondeur de 3-5 cm, espacées de 20-25 cm sur des rangs distants de 70-90 cm. L’arrosage est crucial pendant la phase de croissance et la floraison. Le désherbage doit être régulier et l'application d'engrais supplémentaire (azote) est recommandée au stade de croissance végétative.`,
  },
  rice: {
    title: "Riz",
    image: riceImg,
    description: `🌾 Le riz nécessite des zones humides avec des températures comprises entre 25°C et 35°C. Il pousse dans des champs inondés appelés rizières. Le sol idéal est argileux ou limoneux, retenant bien l’eau. Avant le semis, il faut préparer les semis en pépinière. Après 20-30 jours, les plants sont transplantés dans les rizières. Une fertilisation en azote, phosphore et potassium est importante, répartie tout au long du cycle. L’irrigation doit être constante, et la récolte se fait 3 à 4 mois après la transplantation.`,
  },
  wheat: {
    title: "Blé",
    image: wheatImg,
    description: `🌾 Le blé préfère les climats frais au début et plus chauds en fin de cycle. Température idéale : 15°C à 25°C. Le sol doit être bien drainé, argilo-limoneux, avec un pH entre 6,0 et 7,5. Préparez bien le sol, semez à une profondeur de 4-5 cm. L'irrigation est nécessaire à des stades clés : tallage, montaison et remplissage des grains. Le blé est sensible aux maladies comme la rouille, donc surveillez régulièrement. La récolte se fait quand les grains sont durs et dorés.`,
  },
  soyabeans: {
    title: "Soja",
    image: soyabeansImg,
    description: `🌱 Le soja est une légumineuse riche en protéines. Il pousse bien dans des sols fertiles, bien drainés, avec un pH entre 6 et 7. Les températures idéales varient entre 20°C et 30°C. Les graines doivent être semées à une profondeur de 2-3 cm, espacées de 5-10 cm sur des lignes de 40-60 cm. Le soja fixe l’azote, donc un apport modéré en engrais est suffisant. Arrosez pendant la floraison et le remplissage des gousses. Protégez contre les insectes et les maladies fongiques.`,
  },
  beans: {
    title: "Haricots",
    image: beansImg,
    description: `🌱 Les haricots nécessitent un sol léger, bien drainé et riche en matière organique. Température idéale : 18°C à 27°C. Évitez les sols trop humides. Semez les graines à 2-4 cm de profondeur, espacées de 8-10 cm. L’arrosage doit être régulier mais modéré. Un tuteur est nécessaire pour les variétés grimpantes. Évitez les excès d’engrais azotés. Récoltez les gousses jeunes pour une meilleure tendreté.`,
  },
  peas: {
    title: "Pois",
    image: peasImg,
    description: `🌱 Les pois poussent mieux par temps frais (10°C à 24°C). Le sol doit être sablo-limoneux, bien drainé, avec un pH entre 6 et 7. Semez les graines à 2-4 cm de profondeur, avec un espacement de 5-10 cm. Arrosez régulièrement mais évitez l’excès d’eau. Les pois sont sensibles à la chaleur, donc la culture est idéale en saison fraîche. Récoltez dès que les gousses sont pleines mais encore tendres.`,
  },
  groundnuts: {
    title: "Arachide",
    image: groundnutsImg,
    description: `🥜 L’arachide pousse dans les sols sableux bien drainés avec un pH de 5,5 à 7,0. Température idéale : 25°C à 30°C. Semez les graines à une profondeur de 4-6 cm avec un espacement de 10-15 cm. Arrosez modérément, surtout pendant la floraison et le remplissage des gousses. L’arachide a besoin de calcium pour le bon développement des gousses. La récolte se fait lorsque les feuilles jaunissent et les gousses sont dures.`,
  },
  cowpeas: {
    title: "Niébé",
    image: cowpeasImg,
    description: `🌱 Le niébé est une culture résistante à la sécheresse. Il préfère les climats chauds (25°C à 35°C) et les sols sablo-limoneux bien drainés. Semez à une profondeur de 3-5 cm, espacés de 20-30 cm. Il est peu exigeant en fertilisation, mais une inoculation des semences avec Rhizobium peut améliorer les rendements. Arrosez modérément et évitez les périodes d’excès d’eau. Récoltez les gousses mûres mais avant qu’elles ne se dessèchent.`,
  },
  banana: {
    title: "Banane",
    image: bananaImg,
    description: `🍌 Le bananier nécessite un climat tropical humide avec des températures de 25°C à 35°C. Il pousse dans des sols riches en matière organique, bien drainés, avec un pH de 6 à 7,5. Plantez des rejets dans des trous enrichis en compost. Arrosez fréquemment sans inonder. Ajoutez régulièrement des engrais riches en potassium. Le bananier est sensible au vent, donc des brise-vents sont recommandés. Récoltez les régimes lorsqu'ils atteignent leur taille normale et que les fruits deviennent légèrement anguleux.`,
  },
  grapes: {
    title: "Raisin",
    image: grapesImg,
    description: `🍇 La vigne préfère les climats tempérés à chauds, avec une température idéale de 15°C à 30°C. Le sol doit être bien drainé, légèrement alcalin à neutre. Les plants doivent être espacés (2 à 3 mètres) et palissés. Taillez régulièrement pour encourager la production. L’irrigation est essentielle au moment de la formation des grappes, mais évitez l’humidité excessive. Protégez les raisins contre les champignons et les oiseaux. Récoltez à maturité complète.`,
  },
  watermelon: {
    title: "Pastèque",
    image: watermelonImg,
    description: `🍉 La pastèque demande des températures chaudes (25°C à 35°C) et un sol sablo-limoneux, riche en matière organique. Le pH idéal est de 6 à 6,8. Semez les graines directement ou repiquez les jeunes plants. Arrosez régulièrement jusqu'à la fructification, puis réduisez l’irrigation pour améliorer la saveur. Protégez les fruits du contact direct avec le sol. Récoltez quand la tige du fruit sèche et que la peau devient mate.`,
  },
  apple: {
    title: "Pomme",
    image: appleImg,
    description: `🍎 Le pommier nécessite des climats tempérés froids avec un hiver marqué. Température idéale : 0°C à 21°C. Le sol doit être profond, bien drainé, légèrement acide à neutre (pH 6 à 7). Plantez les greffons dans des trous riches en compost. Taillez les arbres chaque année. Arrosez régulièrement, surtout en période sèche. Les pommes demandent une pollinisation croisée, donc il est conseillé de planter plusieurs variétés. Récoltez les fruits quand ils sont colorés, fermes et légèrement sucrés.`,
  },
  cotton: {
    title: "Coton",
    image: cottonImg,
    description: `🌱 Le coton pousse bien dans les zones chaudes avec des températures entre 21°C et 30°C. Il préfère un sol bien drainé, sablo-limoneux, avec un pH de 5,8 à 8. Semez les graines à 2-3 cm de profondeur, espacées de 10-15 cm. L’irrigation est importante jusqu’à la floraison, puis réduite à la maturation. Il est sensible aux insectes, donc une protection phytosanitaire est souvent nécessaire. Récoltez les capsules lorsqu'elles s’ouvrent naturellement.`,
  },
  mungbean: {
  title: "Haricot mungo",
  image: mungbeanImg, // Assure-toi que le fichier mungbean.jpg est bien dans assets/crops
  description: `🌱 Le haricot mungo (mungbean) est une légumineuse riche en protéines, idéale pour les climats chauds et secs. Il pousse bien dans des sols sablo-limoneux bien drainés, avec un pH de 6 à 7,5. Semez les graines à une profondeur de 3-4 cm, espacées de 5-10 cm. L’arrosage est important au moment de la floraison et du remplissage des gousses. Cette plante fixe l’azote de l’air, réduisant les besoins en engrais. Récoltez les gousses dès qu'elles commencent à jaunir pour éviter les pertes par éclatement.`,
},

coconut: {
  title: "Cocotier",
  image: coconutImg, // Assure-toi que le fichier coconut.jpg est bien dans assets/crops
  description: `🥥 Le cocotier prospère dans les zones côtières tropicales avec des températures constantes entre 27°C et 32°C et une forte humidité. Il préfère les sols sableux profonds et bien drainés, riches en matière organique. Plantez les noix de coco germées à une profondeur d’environ 30-40 cm, espacées de 7 à 10 mètres. Un bon arrosage est nécessaire en période sèche. Fertilisez régulièrement avec du potassium, du bore et du magnésium. La récolte commence environ 5 à 6 ans après la plantation.`,
},
mothbeans: {
  title: "mothbeans",
  image: mothbeansImg, // Assure-toi que le fichier coconut.jpg est bien dans assets/crops
  description: `🌱 Les Moth Beans (ou haricots mat) sont une légumineuse résistante à la sécheresse, idéale pour les zones arides. Elles poussent bien dans des sols sablo-limoneux bien drainés, avec un pH entre 6,0 et 7,5.Semez les graines à une profondeur de 3-5 cm, espacées de 10 à 15 cm. Elles nécessitent peu d’eau, mais un arrosage modéré pendant la floraison peut améliorer les rendements.Peu exigeantes en engrais, elles fixent l’azote de l’air.La récolte s’effectue environ 60 à 75 jours après le semis, lorsque les gousses sont sèches.`,
},
jute: {
  title: "Jute",
  image: juteImg,
  description: `🧵 La jute se cultive dans les régions chaudes et humides avec des températures entre 24°C et 37°C. Elle nécessite un sol alluvial bien drainé, riche en nutriments. 🌧️ Un bon niveau de pluie (plus de 1500 mm pendant la saison) est essentiel. Les semis se font en ligne, directement en plein champ. 🌱 L’éclaircissage est nécessaire pour espacer les plants. Peu exigeante en fertilisation, elle bénéficie d’un apport modéré en azote. 🌾 La récolte se fait 100 à 120 jours après semis, suivie du rouissage (trempage dans l’eau) pour extraire les fibres.`,
},
coffee: {
  title: "Café",
  image: coffeeImg,
  description: `☕ Le caféier pousse dans les zones tropicales entre 18°C et 24°C, à l'ombre partielle. Il préfère un sol riche en humus, bien drainé et légèrement acide (pH entre 6 et 6,5). 🌱 Les plants de café sont d'abord cultivés en pépinière pendant 6 à 12 mois avant d'être transplantés. 🌿 L'arrosage doit être régulier mais modéré, car un excès d’eau peut nuire aux racines. Une fertilisation équilibrée (azote, phosphore, potassium) améliore la production. La récolte a lieu 2 à 3 ans après plantation, généralement à la main.`,
},
orange: {
  title: "Orange",
  image: orangeImg,
  description: `🍊 L'oranger prospère dans les climats subtropicaux avec des températures entre 15°C et 30°C. Il préfère un sol bien drainé, sablo-limoneux, légèrement acide à neutre (pH 6-7). 🌱 Les jeunes plants sont élevés en pépinière puis transplantés au champ. 🌿 L’irrigation doit être régulière, surtout pendant la floraison et la formation des fruits. Une fertilisation riche en azote, phosphore et potassium favorise la qualité des fruits. La récolte a lieu 3 à 5 ans après la plantation.`,
},
blackgram: {
  title: "Blackgram",
  image: blackgramImg,
  description: `🌾 Le blackgram (urad) est une légumineuse qui pousse bien dans les climats chauds et humides, entre 25°C et 35°C. Il préfère un sol argilo-limoneux bien drainé avec un pH de 6 à 7,5. 🌱 Il se sème directement en pleine terre. 🌿 Une irrigation légère au moment de la floraison et de la formation des gousses améliore le rendement. Le blackgram enrichit naturellement le sol en azote. La récolte intervient environ 80 à 100 jours après le semis.`,
},
muskmelon: {
  title: "Melon (Muskmelon)",
  image: muskmelonImg,
  description: `🍈 Le melon musqué préfère un climat chaud et sec, avec des températures entre 25°C et 35°C. Il pousse bien dans des sols sablo-limoneux bien drainés avec un pH de 6 à 6,8. 🌱 Les graines sont semées directement au champ après le dernier gel. 🌿 L’irrigation doit être modérée, réduite durant la maturation pour concentrer les sucres. Une fertilisation équilibrée stimule la croissance. La récolte a lieu 75 à 90 jours après le semis.`,
},
mango: {
  title: "Mangue",
  image: mangoImg,
  description: `🥭 Le manguier prospère dans les zones tropicales à subtropicales, avec des températures entre 24°C et 30°C. Il préfère les sols profonds, bien drainés, légèrement acides à neutres (pH 5,5 à 7,5). 🌱 Les plants sont issus de greffage ou semis et mis en terre en saison sèche. 🌿 L’arrosage est essentiel durant les premières années. Une taille régulière améliore la structure de l’arbre. Les premières récoltes interviennent après 3 à 5 ans selon la variété.`,
},
papaya: {
  title: "Papaye",
  image: papayaImg,
  description: `🍃 Le papayer pousse dans les climats tropicaux et chauds, entre 20°C et 35°C. Il préfère un sol sablo-limoneux, riche en matière organique et bien drainé (pH 6-6,5). 🌱 Il se multiplie par semis direct ou par transplantation. 🌿 L’irrigation régulière est indispensable pour une croissance rapide. Une fertilisation équilibrée en NPK stimule la fructification. La récolte commence 6 à 9 mois après la plantation, selon les conditions.`,
},
pigeonpea: {
  title: "Pois d’Angole (Pigeonpea)",
  image: pigeonpeaImg,
  description: `🌿 Le pois d’Angole est une légumineuse résistante à la sécheresse, poussant bien entre 18°C et 38°C. Il tolère divers types de sols mais préfère les sols bien drainés avec un pH de 5 à 7. 🌱 Il est semé directement au champ. 🌾 Peu exigeant en eau, il fixe l’azote atmosphérique et améliore la fertilité du sol. Il nécessite peu d’entretien et peut être récolté 4 à 6 mois après le semis selon la variété.`,
},
pomegranate: {
  title: "Grenade",
  image: pomegranateImg,
  description: `🍎 Le grenadier s’adapte bien aux climats arides et semi-arides, avec des températures de 25°C à 35°C. Il préfère un sol léger, bien drainé, au pH de 5.5 à 7. 🌱 Les plants peuvent être issus de boutures ou de greffage. 💧 Une irrigation régulière améliore la fructification, surtout en période sèche. Une fertilisation équilibrée et un bon ensoleillement garantissent une bonne qualité des fruits. La récolte débute 2 à 3 ans après plantation.`,
},

};
