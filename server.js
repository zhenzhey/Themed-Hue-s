const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    methods: ['GET', 'POST']
  },
  pingInterval: 10000,
  pingTimeout: 20000,
  transports: ['websocket', 'polling']
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
  });
}

// ─── Game Data ────────────────────────────────────────────────────────────────
// difficulty: 1 = easy/famous, 2 = medium, 3 = hard

const themes = {
  us_tech: {
    id: 'us_tech',
    name: 'US Tech Giants',
    emoji: '💻',
    characters: [
      {
        id: 'google', difficulty: 1,
        name: 'Google', hint: 'Don\'t Be Evil',
        colors: [
          { name: 'Cobalt Blue', hex: '#4285F4', textColor: '#FFFFFF' },
          { name: 'Tomato Red', hex: '#EA4335', textColor: '#FFFFFF' },
          { name: 'Sunflower Yellow', hex: '#FBBC05', textColor: '#5A4000' },
          { name: 'Fresh Green', hex: '#34A853', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['google', 'google inc', 'alphabet']
      },
      {
        id: 'apple', difficulty: 1,
        name: 'Apple', hint: 'Think Different',
        colors: [
          { name: 'Space Gray', hex: '#555555', textColor: '#FFFFFF' },
          { name: 'Silver White', hex: '#F5F5F7', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['apple', 'apple inc', 'apple computer']
      },
      {
        id: 'microsoft', difficulty: 1,
        name: 'Microsoft', hint: 'Be What\'s Next',
        colors: [
          { name: 'Brick Red', hex: '#F25022', textColor: '#FFFFFF' },
          { name: 'Lime Green', hex: '#7FBA00', textColor: '#FFFFFF' },
          { name: 'Sky Blue', hex: '#00A4EF', textColor: '#FFFFFF' },
          { name: 'Amber Yellow', hex: '#FFB900', textColor: '#5A4000' }
        ],
        acceptedNames: ['microsoft', 'microsoft corp', 'msft']
      },
      {
        id: 'amazon', difficulty: 1,
        name: 'Amazon', hint: 'From A to Z',
        colors: [
          { name: 'Warm Orange', hex: '#FF9900', textColor: '#FFFFFF' },
          { name: 'Dark Navy', hex: '#232F3E', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['amazon', 'amazon.com', 'amazon inc']
      },
      {
        id: 'netflix', difficulty: 1,
        name: 'Netflix', hint: 'One More Episode',
        colors: [
          { name: 'Crimson Red', hex: '#E50914', textColor: '#FFFFFF' },
          { name: 'Charcoal Black', hex: '#141414', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['netflix', 'netflix inc']
      },
      {
        id: 'meta', difficulty: 1,
        name: 'Meta', hint: 'Move Fast and Break Things',
        colors: [
          { name: 'Bright Blue', hex: '#0082FB', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['meta', 'facebook', 'meta platforms', 'fb']
      },
      {
        id: 'spotify', difficulty: 1,
        name: 'Spotify', hint: 'Soundtrack Your Life',
        colors: [
          { name: 'Neon Green', hex: '#1DB954', textColor: '#FFFFFF' },
          { name: 'Midnight Black', hex: '#191414', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['spotify', 'spotify ab']
      },
      {
        id: 'youtube', difficulty: 1,
        name: 'YouTube', hint: 'Broadcast Yourself',
        colors: [
          { name: 'Signal Red', hex: '#FF0000', textColor: '#FFFFFF' },
          { name: 'Dark Gray', hex: '#282828', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['youtube', 'yt', 'youtube.com']
      },
      {
        id: 'snapchat', difficulty: 1,
        name: 'Snapchat', hint: 'The Ghost App',
        colors: [
          { name: 'Electric Yellow', hex: '#FFFC00', textColor: '#3A3A00' },
          { name: 'Black', hex: '#1A1A1A', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['snapchat', 'snap', 'snap inc']
      },
      {
        id: 'instagram', difficulty: 2,
        name: 'Instagram', hint: 'Capture & Share the World',
        colors: [
          { name: 'Deep Purple', hex: '#833AB4', textColor: '#FFFFFF' },
          { name: 'Hot Pink', hex: '#E1306C', textColor: '#FFFFFF' },
          { name: 'Sunset Orange', hex: '#F77737', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['instagram', 'ig', 'insta']
      },
      {
        id: 'linkedin', difficulty: 2,
        name: 'LinkedIn', hint: 'Connections Matter',
        colors: [
          { name: 'Corporate Blue', hex: '#0A66C2', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['linkedin', 'linked in', 'linkedin corp']
      },
      {
        id: 'twitter', difficulty: 2,
        name: 'X (Twitter)', hint: 'Everything App',
        colors: [
          { name: 'Sky Blue', hex: '#1DA1F2', textColor: '#FFFFFF' },
          { name: 'Black', hex: '#14171A', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['twitter', 'x', 'x twitter', 'x corp']
      },
      {
        id: 'uber', difficulty: 2,
        name: 'Uber', hint: 'Move the Way You Want',
        colors: [
          { name: 'Black', hex: '#000000', textColor: '#FFFFFF' },
          { name: 'White', hex: '#FFFFFF', textColor: '#1A1A1A' }
        ],
        acceptedNames: ['uber', 'uber technologies']
      },
      {
        id: 'airbnb', difficulty: 2,
        name: 'Airbnb', hint: 'Belong Anywhere',
        colors: [
          { name: 'Rausch Coral', hex: '#FF5A5F', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F7F7F7', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['airbnb', 'air bnb', 'airbnb inc']
      },
      {
        id: 'zoom', difficulty: 2,
        name: 'Zoom', hint: 'Meet Happy',
        colors: [
          { name: 'Vivid Blue', hex: '#2D8CFF', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['zoom', 'zoom video', 'zoom communications']
      },
      {
        id: 'discord', difficulty: 2,
        name: 'Discord', hint: 'Your Place to Talk',
        colors: [
          { name: 'Periwinkle', hex: '#5865F2', textColor: '#FFFFFF' },
          { name: 'Dark Gray', hex: '#23272A', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['discord', 'discord inc']
      },
      {
        id: 'tiktok', difficulty: 2,
        name: 'TikTok', hint: 'Make Your Day',
        colors: [
          { name: 'Pure Black', hex: '#010101', textColor: '#FFFFFF' },
          { name: 'Cyan Teal', hex: '#69C9D0', textColor: '#1A1A1A' },
          { name: 'Vivid Red', hex: '#EE1D52', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['tiktok', 'tik tok', 'douyin']
      },
      {
        id: 'twitch', difficulty: 2,
        name: 'Twitch', hint: 'You\'re Already Here',
        colors: [
          { name: 'Violet Purple', hex: '#9146FF', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['twitch', 'twitch.tv', 'twitch interactive']
      },
      {
        id: 'slack', difficulty: 2,
        name: 'Slack', hint: 'Where Work Happens',
        colors: [
          { name: 'Dark Plum', hex: '#611F69', textColor: '#FFFFFF' },
          { name: 'Aqua Blue', hex: '#36C5F0', textColor: '#FFFFFF' },
          { name: 'Mint Green', hex: '#2EB67D', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['slack', 'slack technologies']
      },
      {
        id: 'pinterest', difficulty: 2,
        name: 'Pinterest', hint: 'Discover Ideas',
        colors: [
          { name: 'Cherry Red', hex: '#E60023', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['pinterest', 'pinterest inc']
      },
      {
        id: 'stripe', difficulty: 3,
        name: 'Stripe', hint: 'Increase the GDP of the Internet',
        colors: [
          { name: 'Electric Indigo', hex: '#635BFF', textColor: '#FFFFFF' },
          { name: 'Midnight', hex: '#0A2540', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['stripe', 'stripe inc', 'stripe payments']
      },
      {
        id: 'dropbox', difficulty: 3,
        name: 'Dropbox', hint: 'Your Stuff, Everywhere',
        colors: [
          { name: 'Royal Blue', hex: '#0061FF', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['dropbox', 'dropbox inc']
      },
      {
        id: 'salesforce', difficulty: 3,
        name: 'Salesforce', hint: 'No Software',
        colors: [
          { name: 'Cloud Blue', hex: '#00A1E0', textColor: '#FFFFFF' },
          { name: 'Sky Blue', hex: '#009EDB', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['salesforce', 'salesforce.com', 'sfdc']
      },
      {
        id: 'adobe', difficulty: 3,
        name: 'Adobe', hint: 'Creativity for All',
        colors: [
          { name: 'Flame Red', hex: '#FA0F00', textColor: '#FFFFFF' },
          { name: 'Dark Gray', hex: '#2C2C2C', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['adobe', 'adobe inc', 'adobe systems']
      },
      {
        id: 'nvidia', difficulty: 3,
        name: 'NVIDIA', hint: 'The Way It\'s Meant to Be Played',
        colors: [
          { name: 'Chartreuse Green', hex: '#76B900', textColor: '#FFFFFF' },
          { name: 'Black', hex: '#1A1A1A', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['nvidia', 'nvidia corp']
      }
    ]
  },
  disney_princess: {
    id: 'disney_princess',
    name: 'Disney Princesses',
    emoji: '👸',
    characters: [
      {
        id: 'elsa', difficulty: 1,
        name: 'Elsa', hint: 'Frozen',
        colors: [
          { name: 'Ice Blue', hex: '#74B9FF', textColor: '#FFFFFF' },
          { name: 'Snow White', hex: '#DFE6E9', textColor: '#4A5568' }
        ],
        acceptedNames: ['elsa', 'frozen elsa', 'ice queen']
      },
      {
        id: 'anna', difficulty: 1,
        name: 'Anna', hint: 'Frozen',
        colors: [
          { name: 'Sky Blue', hex: '#aedfea', textColor: '#FFFFFF' },
          { name: 'Chestnut Brown', hex: '#8B5E3C', textColor: '#FFE4A0' },
          { name: 'Orchid Violet', hex: '#c81fa2', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['anna', 'frozen anna', 'princess anna']
      },
      {
        id: 'cinderella', difficulty: 1,
        name: 'Cinderella', hint: 'Cinderella',
        colors: [
          { name: 'Sky Blue', hex: '#87CEEB', textColor: '#1A5C80' },
          { name: 'Silver', hex: '#B8B8C8', textColor: '#3A3A4A' }
        ],
        acceptedNames: ['cinderella', 'cindy', 'ella']
      },
      {
        id: 'ariel', difficulty: 1,
        name: 'Ariel', hint: 'The Little Mermaid',
        colors: [
          { name: 'Fiery Red', hex: '#E8403C', textColor: '#FFFFFF' },
          { name: 'Sea Teal', hex: '#2BC0B4', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['ariel', 'the little mermaid', 'little mermaid']
      },
      {
        id: 'moana', difficulty: 1,
        name: 'Moana', hint: 'Moana',
        colors: [
          { name: 'Coral Red', hex: '#E8484C', textColor: '#FFFFFF' },
          { name: 'Warm Orange', hex: '#FF8C42', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['moana', 'vaiana']
      },
      {
        id: 'mulan', difficulty: 1,
        name: 'Mulan', hint: 'Mulan',
        colors: [
          { name: 'Dusty Rose', hex: '#FF6B8A', textColor: '#FFFFFF' },
          { name: 'Copper Gold', hex: '#D4AF37', textColor: '#5A3E00' }
        ],
        acceptedNames: ['mulan', 'hua mulan', 'fa mulan']
      },
      {
        id: 'belle', difficulty: 1,
        name: 'Belle', hint: 'Beauty and the Beast',
        colors: [
          { name: 'Golden Yellow', hex: '#F5C842', textColor: '#7A5C00' },
          { name: 'Warm Brown', hex: '#8B5E3C', textColor: '#FFE4A0' }
        ],
        acceptedNames: ['belle', 'beauty', 'beauty and the beast']
      },
      {
        id: 'snow_white', difficulty: 1,
        name: 'Snow White', hint: 'Snow White and the Seven Dwarfs',
        colors: [
          { name: 'Crimson Red', hex: '#C41E3A', textColor: '#FFFFFF' },
          { name: 'Royal Blue', hex: '#2445AB', textColor: '#FFFFFF' },
          { name: 'Pale Yellow', hex: '#F5D800', textColor: '#7A5C00' }
        ],
        acceptedNames: ['snow white', 'snowwhite', 'snow']
      },
      {
        id: 'jasmine', difficulty: 2,
        name: 'Jasmine', hint: 'Aladdin',
        colors: [
          { name: 'Teal', hex: '#20B2AA', textColor: '#FFFFFF' },
          { name: 'Deep Purple', hex: '#6A3D9A', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['jasmine', 'aladdin princess', 'princess jasmine']
      },
      {
        id: 'rapunzel', difficulty: 2,
        name: 'Rapunzel', hint: 'Tangled',
        colors: [
          { name: 'Lilac Purple', hex: '#9B59B6', textColor: '#FFFFFF' },
          { name: 'Blush Pink', hex: '#FF85A1', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['rapunzel', 'tangled', 'pascal']
      },
      {
        id: 'aurora', difficulty: 2,
        name: 'Aurora', hint: 'Sleeping Beauty',
        colors: [
          { name: 'Rose Pink', hex: '#FF9EB5', textColor: '#6B1F35' },
          { name: 'Royal Blue', hex: '#3A5FCD', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['aurora', 'sleeping beauty', 'briar rose']
      },
      {
        id: 'tiana', difficulty: 2,
        name: 'Tiana', hint: 'The Princess and the Frog',
        colors: [
          { name: 'Emerald Green', hex: '#27AE60', textColor: '#FFFFFF' },
          { name: 'Warm Gold', hex: '#F39C12', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['tiana', 'princess and the frog', 'princess tiana']
      },
      {
        id: 'merida', difficulty: 3,
        name: 'Merida', hint: 'Brave',
        colors: [
          { name: 'Flame Orange', hex: '#E17055', textColor: '#FFFFFF' },
          { name: 'Forest Green', hex: '#00695C', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['merida', 'brave', 'princess merida']
      },
      {
        id: 'pocahontas', difficulty: 3,
        name: 'Pocahontas', hint: 'Pocahontas',
        colors: [
          { name: 'Earthy Brown', hex: '#A0522D', textColor: '#FFFFFF' },
          { name: 'Purple', hex: '#8B5CF6', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['pocahontas', 'poca']
      }
    ]
  },
  disney_classic: {
    id: 'disney_classic',
    name: 'Classic Disney',
    emoji: '🏰',
    characters: [
      {
        id: 'mickey', difficulty: 1,
        name: 'Mickey Mouse', hint: 'Mickey Mouse Clubhouse',
        colors: [
          { name: 'Black', hex: '#2D2D2D', textColor: '#FFFFFF' },
          { name: 'Bright Red', hex: '#D32F2F', textColor: '#FFFFFF' },
          { name: 'Yellow', hex: '#FDD835', textColor: '#5A4000' }
        ],
        acceptedNames: ['mickey', 'mickey mouse', 'mouse']
      },
      {
        id: 'minnie', difficulty: 1,
        name: 'Minnie Mouse', hint: "Minnie's Bow-Toons",
        colors: [
          { name: 'Black', hex: '#2D2D2D', textColor: '#FFFFFF' },
          { name: 'Hot Pink', hex: '#E91E63', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['minnie', 'minnie mouse']
      },
      {
        id: 'simba', difficulty: 1,
        name: 'Simba', hint: 'The Lion King',
        colors: [
          { name: 'Orange Gold', hex: '#FF8F00', textColor: '#FFFFFF' },
          { name: 'Brown', hex: '#6D4C41', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['simba', 'lion king', 'the lion king']
      },
      {
        id: 'donald', difficulty: 2,
        name: 'Donald Duck', hint: 'Donald Duck',
        colors: [
          { name: 'Cobalt Blue', hex: '#1565C0', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['donald', 'donald duck', 'duck']
      },
      {
        id: 'dumbo', difficulty: 2,
        name: 'Dumbo', hint: 'Dumbo',
        colors: [
          { name: 'Blue Gray', hex: '#90A4AE', textColor: '#FFFFFF' },
          { name: 'Light Pink', hex: '#F48FB1', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['dumbo', 'flying elephant', 'jumbo']
      },
      {
        id: 'bambi', difficulty: 3,
        name: 'Bambi', hint: 'Bambi',
        colors: [
          { name: 'Light Tan', hex: '#D2A679', textColor: '#5A3A00' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['bambi', 'little deer', 'deer']
      }
    ]
  },
  fast_food: {
    id: 'fast_food',
    name: 'Fast Food',
    emoji: '🍔',
    characters: [
      {
        id: 'mcdonalds', difficulty: 1,
        name: "McDonald's", hint: "I'm Lovin' It",
        colors: [
          { name: 'Bright Red', hex: '#DA291C', textColor: '#FFFFFF' },
          { name: 'Golden Yellow', hex: '#FFC72C', textColor: '#7A4A00' }
        ],
        acceptedNames: ["mcdonald's", 'mcdonalds', 'mcd', 'mc donalds', 'micky d', 'golden arches']
      },
      {
        id: 'starbucks', difficulty: 1,
        name: 'Starbucks', hint: 'Your Third Place',
        colors: [
          { name: 'Forest Green', hex: '#00704A', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['starbucks', 'starbuck']
      },
      {
        id: 'kfc', difficulty: 1,
        name: 'KFC', hint: "Finger Lickin' Good",
        colors: [
          { name: 'Bright Red', hex: '#F40027', textColor: '#FFFFFF' },
          { name: 'Cream White', hex: '#F5F0E8', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['kfc', 'kentucky fried chicken', 'kentucky']
      },
      {
        id: 'subway', difficulty: 1,
        name: 'Subway', hint: 'Eat Fresh',
        colors: [
          { name: 'Forest Green', hex: '#008C15', textColor: '#FFFFFF' },
          { name: 'Bright Yellow', hex: '#FFC600', textColor: '#5A4000' }
        ],
        acceptedNames: ['subway', 'sub']
      },
      {
        id: 'burger_king', difficulty: 2,
        name: 'Burger King', hint: 'Have it your way',
        colors: [
          { name: 'Bright Red', hex: '#D62300', textColor: '#FFFFFF' },
          { name: 'Golden Yellow', hex: '#F5A800', textColor: '#5A3A00' },
          { name: 'Royal Blue', hex: '#003594', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['burger king', 'bk', 'burgerking']
      },
      {
        id: 'taco_bell', difficulty: 2,
        name: 'Taco Bell', hint: 'Live Más',
        colors: [
          { name: 'Deep Purple', hex: '#702082', textColor: '#FFFFFF' },
          { name: 'Cream White', hex: '#F5F0E8', textColor: '#4A4A4A' },
          { name: 'Lavender Purple', hex: '#9679a7', textColor: '#FFFFFF' }

        ],
        acceptedNames: ['taco bell', 'tacobell', 'taco']
      },
      {
        id: 'dunkin', difficulty: 2,
        name: "Dunkin'", hint: 'America Runs on Dunkin',
        colors: [
          { name: 'Bright Orange', hex: '#FF671F', textColor: '#FFFFFF' },
          { name: 'Hot Pink', hex: '#DA1884', textColor: '#FFFFFF' }
        ],
        acceptedNames: ["dunkin'", 'dunkin', "dunkin donuts", "dunkin' donuts", 'dd']
      },
      {
        id: 'in_n_out', difficulty: 2,
        name: 'In-N-Out', hint: 'Animal Style',
        colors: [
          { name: 'Bright Red', hex: '#CC2529', textColor: '#FFFFFF' },
          { name: 'Bright Yellow', hex: '#F8D000', textColor: '#5A4000' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['in-n-out', 'in and out', 'in n out', 'innout']
      },
      {
        id: 'chipotle', difficulty: 3,
        name: 'Chipotle', hint: 'Food with Integrity',
        colors: [
          { name: 'Earthy Brown', hex: '#441500', textColor: '#FFD09B' },
          { name: 'Terracotta', hex: '#A2320F', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['chipotle', 'chipotle mexican grill']
      },
      {
        id: 'shake_shack', difficulty: 3,
        name: 'Shake Shack', hint: 'Stand for Something Good',
        colors: [
          { name: 'Forest Green', hex: '#3D7A3A', textColor: '#FFFFFF' },
          { name: 'Cream White', hex: '#F5F0E0', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['shake shack', 'shakeshack', 'shack']
      },
      {
        id: 'dominos', difficulty: 3,
        name: "Domino's", hint: '30 Minutes or Less',
        colors: [
          { name: 'Deep Blue', hex: '#006491', textColor: '#FFFFFF' },
          { name: 'Bright Red', hex: '#E31837', textColor: '#FFFFFF' }
        ],
        acceptedNames: ["domino's", 'dominos', 'domino']
      },
      {
        id: 'pizza_hut', difficulty: 1,
        name: 'Pizza Hut', hint: 'No One Out-Pizzas the Hut',
        colors: [
          { name: 'Scarlet Red', hex: '#EE3224', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['pizza hut', 'pizzahut', 'the hut']
      },
      {
        id: 'wendys', difficulty: 2,
        name: "Wendy's", hint: "Quality Is Our Recipe",
        colors: [
          { name: 'Ruby Red', hex: '#E2231A', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ["wendy's", 'wendys', 'wendy']
      },
      {
        id: 'chick_fil_a', difficulty: 2,
        name: 'Chick-fil-A', hint: 'Eat Mor Chikin',
        colors: [
          { name: 'Crimson Red', hex: '#E51636', textColor: '#FFFFFF' },
          { name: 'White', hex: '#FFFFFF', textColor: '#E51636' }
        ],
        acceptedNames: ['chick-fil-a', 'chick fil a', 'chickfila', 'cfa']
      },
      {
        id: 'five_guys', difficulty: 2,
        name: 'Five Guys', hint: 'Free Peanuts',
        colors: [
          { name: 'Dark Red', hex: '#CE2029', textColor: '#FFFFFF' },
          { name: 'Bright Yellow', hex: '#FFD100', textColor: '#5A4000' }
        ],
        acceptedNames: ['five guys', 'fiveguys', '5 guys']
      },
      {
        id: 'panda_express', difficulty: 2,
        name: 'Panda Express', hint: 'Orange Chicken Nation',
        colors: [
          { name: 'Lipstick Red', hex: '#C8102E', textColor: '#FFFFFF' },
          { name: 'Black', hex: '#1A1A1A', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['panda express', 'pandaexpress', 'panda']
      },
      {
        id: 'popeyes', difficulty: 2,
        name: "Popeyes", hint: "Love That Chicken",
        colors: [
          { name: 'Burnt Orange', hex: '#FA7A1E', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ["popeyes", 'popeyes louisiana kitchen', 'popeye']
      },
      {
        id: 'panera', difficulty: 3,
        name: 'Panera Bread', hint: 'You Pick Two — Fast Casual',
        colors: [
          { name: 'Olive Green', hex: '#4A8123', textColor: '#FFFFFF' },
          { name: 'Warm Cream', hex: '#E8DCC8', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['panera bread', 'panera', 'panera bakery']
      },
      {
        id: 'primanti', difficulty: 2,
        name: "Primanti Brothers", hint: 'Fries Go Inside the Sandwich',
        colors: [
          { name: 'Pittsburgh Black', hex: '#1A1A1A', textColor: '#FFFFFF' },
          { name: 'Pittsburgh Gold', hex: '#FFB81C', textColor: '#3A2800' }
        ],
        acceptedNames: ["primanti brothers", "primanti", "primantis", "primanti's"]
      },
      {
        id: 'eatnpark', difficulty: 3,
        name: "Eat'n Park", hint: 'Home of the Smiley Cookie',
        colors: [
          { name: 'Forest Green', hex: '#2E7D32', textColor: '#FFFFFF' },
          { name: 'Warm Orange', hex: '#F57C00', textColor: '#FFFFFF' }
        ],
        acceptedNames: ["eat'n park", "eatn park", "eat n park", "eatnpark"]
      }
    ]
  },
  drinks: {
    id: 'drinks',
    name: 'Drinks & Sodas',
    emoji: '🥤',
    characters: [
      {
        id: 'coca_cola', difficulty: 1,
        name: 'Coca-Cola', hint: 'Open Happiness',
        colors: [
          { name: 'Bright Red', hex: '#F40009', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['coca-cola', 'coca cola', 'coke', 'cola']
      },
      {
        id: 'pepsi', difficulty: 1,
        name: 'Pepsi', hint: "The Choice of a New Generation",
        colors: [
          { name: 'Royal Blue', hex: '#004B93', textColor: '#FFFFFF' },
          { name: 'Bright Red', hex: '#ED1C24', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['pepsi', 'pepsi cola']
      },
      {
        id: 'sprite', difficulty: 1,
        name: 'Sprite', hint: 'Obey Your Thirst',
        colors: [
          { name: 'Lime Green', hex: '#00A74A', textColor: '#FFFFFF' },
          { name: 'Bright Yellow', hex: '#FFD700', textColor: '#5A4000' }
        ],
        acceptedNames: ['sprite', 'sprite soda']
      },
      {
        id: 'fanta', difficulty: 1,
        name: 'Fanta', hint: 'Don\'t You Wanta?',
        colors: [
          { name: 'Bright Orange', hex: '#F7941D', textColor: '#FFFFFF' },
          { name: 'White', hex: '#F5F5F5', textColor: '#4A4A4A' }
        ],
        acceptedNames: ['fanta', 'fanta orange']
      },
      {
        id: 'mountain_dew', difficulty: 2,
        name: 'Mountain Dew', hint: 'Do the Dew',
        colors: [
          { name: 'Electric Green', hex: '#97D700', textColor: '#3A5500' },
          { name: 'Deep Green', hex: '#1A5C00', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['mountain dew', 'mtn dew', 'dew', 'mountaindew']
      },
      {
        id: 'dr_pepper', difficulty: 2,
        name: 'Dr Pepper', hint: 'I\'m a Pepper',
        colors: [
          { name: 'Deep Maroon', hex: '#8B0000', textColor: '#FFFFFF' },
          { name: 'Silver', hex: '#C0C0C0', textColor: '#3A3A3A' }
        ],
        acceptedNames: ['dr pepper', 'dr. pepper', 'drpepper', 'doctor pepper']
      },
      {
        id: '7up', difficulty: 2,
        name: '7UP', hint: 'The Uncola',
        colors: [
          { name: 'Bright Green', hex: '#00A651', textColor: '#FFFFFF' },
          { name: 'Red Dot', hex: '#ED1C24', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['7up', '7-up', 'seven up', 'sevenup']
      },
      {
        id: 'red_bull', difficulty: 3,
        name: 'Red Bull', hint: 'Gives You Wings',
        colors: [
          { name: 'Cobalt Blue', hex: '#1E3E7B', textColor: '#FFFFFF' },
          { name: 'Silver', hex: '#C0C0C0', textColor: '#3A3A3A' },
          { name: 'Bright Red', hex: '#CC0000', textColor: '#FFFFFF' }
        ],
        acceptedNames: ['red bull', 'redbull']
      },
      {
        id: 'monster', difficulty: 3,
        name: 'Monster', hint: 'Unleash the Beast',
        colors: [
          { name: 'Black', hex: '#1A1A1A', textColor: '#FFFFFF' },
          { name: 'Neon Green', hex: '#7AB800', textColor: '#1A1A1A' }
        ],
        acceptedNames: ['monster', 'monster energy']
      }
    ]
  }
};

// ─── Room Management ──────────────────────────────────────────────────────────

const rooms = new Map();

function generateRoomCode() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
}

function pickCharacter(room, themeData) {
  let unused = themeData.characters.filter(c => !room.usedCharacterIds.has(c.id));
  if (unused.length === 0) {
    room.usedCharacterIds.clear();
    unused = [...themeData.characters];
  }
  // Pick lowest difficulty first; randomize within same tier
  const minDiff = Math.min(...unused.map(c => c.difficulty));
  const candidates = unused.filter(c => c.difficulty === minDiff);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function sanitizeRoom(room) {
  return {
    code: room.code,
    theme: room.theme,
    host: room.host,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      avatarColor: p.avatarColor,
      score: p.score,
      isHost: p.isHost
    })),
    state: room.state,
    roundNumber: room.roundNumber
  };
}

// ─── Socket Events ────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('create_room', ({ theme, playerName, avatarColor }) => {
    const roomCode = generateRoomCode();
    const room = {
      code: roomCode,
      theme: theme || 'disney_princess',
      host: socket.id,
      players: [{
        id: socket.id,
        name: playerName || 'Player 1',
        avatarColor: avatarColor || null,
        score: 0,
        isHost: true,
        skipped: false,
        hintsUsed: 0
      }],
      state: 'lobby',
      currentCharacter: null,
      colorAssignments: {},
      colorAssignmentsByName: {},
      roundNumber: 0,
      usedCharacterIds: new Set(),
      hintRevealed: false,
      autoHintTimer: null,
      roundLockedUntil: 0,
      disconnectedPlayers: new Map()
    };
    rooms.set(roomCode, room);
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    socket.emit('room_created', { roomCode, room: sanitizeRoom(room) });
    console.log(`Room ${roomCode} created by ${playerName}`);
  });

  socket.on('join_room', ({ roomCode, playerName, avatarColor }) => {
    const code = (roomCode || '').trim();
    const room = rooms.get(code);

    if (!room) {
      socket.emit('join_error', { message: 'Room not found. Please check the room code.' });
      return;
    }
    if (room.state !== 'lobby') {
      // Check if this player has a saved session they can rejoin
      const nameKey = (playerName || '').toLowerCase().trim();
      const saved = room.disconnectedPlayers.get(nameKey);
      if (saved) {
        // Transparently treat as rejoin
        if (saved.cleanupTimer) clearTimeout(saved.cleanupTimer);
        room.disconnectedPlayers.delete(nameKey);
        const restoredPlayer = {
          id: socket.id,
          name: playerName,
          avatarColor: avatarColor || saved.avatarColor,
          score: saved.score,
          isHost: saved.isHost,
          skipped: false,
          hintsUsed: saved.hintsUsed || 0
        };
        if (saved.isHost) room.host = socket.id;
        room.players.push(restoredPlayer);
        socket.join(code);
        socket.data.roomCode = code;
        socket.emit('rejoined_room', {
          roomCode: code,
          room: sanitizeRoom(room),
          isHost: saved.isHost,
          gamePhase: room.state
        });
        if (room.state === 'playing' && room.currentCharacter) {
          const color = room.colorAssignmentsByName[playerName] ||
            room.currentCharacter.colors[room.players.length % room.currentCharacter.colors.length];
          room.colorAssignments[socket.id] = color;
          room.colorAssignmentsByName[playerName] = color;
          socket.emit('round_started', {
            roundNumber: room.roundNumber,
            yourColor: color,
            totalPlayers: room.players.length,
            players: room.players.map(p => ({ id: p.id, name: p.name, avatarColor: p.avatarColor })),
            lockedUntil: 0,
            hintsUsed: restoredPlayer.hintsUsed
          });
          if (room.hintRevealed) {
            socket.emit('hint_revealed', { hint: room.currentCharacter.hint, auto: true });
          }
        }
        socket.to(code).emit('player_joined', { room: sanitizeRoom(room) });
        console.log(`${playerName} transparently rejoined room ${code} with score ${saved.score}`);
        return;
      }
      socket.emit('join_error', { message: 'Game already started.' });
      return;
    }
    if (room.players.length >= 12) {
      socket.emit('join_error', { message: 'Room is full (max 12 players).' });
      return;
    }
    if (room.players.find(p => p.id === socket.id)) {
      socket.emit('join_error', { message: 'You are already in this room.' });
      return;
    }

    room.players.push({
      id: socket.id,
      name: playerName || `Player ${room.players.length + 1}`,
      avatarColor: avatarColor || null,
      score: 0,
      isHost: false,
      skipped: false,
      hintsUsed: 0
    });

    socket.join(code);
    socket.data.roomCode = code;
    socket.emit('room_joined', { roomCode: code, room: sanitizeRoom(room) });
    socket.to(code).emit('player_joined', { room: sanitizeRoom(room) });
    console.log(`${playerName} joined room ${code}`);
  });

  socket.on('start_round', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    console.log('[start_round] roomCode=%s socketId=%s host=%s stateMatch=%s', roomCode, socket.id, room?.host, room ? (room.state === 'lobby' || room.state === 'round_end') : 'no-room');
    if (!room || room.host !== socket.id) { console.log('[start_round] BLOCKED: no room or host mismatch'); return; }
    // Allow starting from lobby or round_end (skips scoreboard screen)
    if (room.state !== 'lobby' && room.state !== 'round_end') { console.log('[start_round] BLOCKED: bad state', room.state); return; }

    const themeData = themes[room.theme];
    console.log('[start_round] theme=%s themeFound=%s', room.theme, !!themeData);
    if (!themeData || themeData.characters.length === 0) { console.log('[start_round] BLOCKED: no theme data'); return; }

    const char = pickCharacter(room, themeData);
    room.usedCharacterIds.add(char.id);
    room.currentCharacter = char;
    room.state = 'playing';
    room.roundNumber++;
    room.hintRevealed = false;
    room.roundLockedUntil = Date.now() + 3000;
    room.players.forEach(p => { p.skipped = false; });
    room.colorAssignments = {};
    room.colorAssignmentsByName = {};

    room.players.forEach((player, i) => {
      const colorIndex = i % char.colors.length;
      room.colorAssignments[player.id] = char.colors[colorIndex];
      room.colorAssignmentsByName[player.name] = char.colors[colorIndex];
    });

    // Clear any existing auto-hint timer
    if (room.autoHintTimer) { clearTimeout(room.autoHintTimer); room.autoHintTimer = null; }

    // Auto-reveal hint after 20 seconds if nobody has guessed
    room.autoHintTimer = setTimeout(() => {
      if (room.state === 'playing' && !room.hintRevealed) {
        room.hintRevealed = true;
        io.to(roomCode).emit('hint_revealed', { hint: char.hint, auto: true });
      }
    }, 20000);

    room.players.forEach(player => {
      io.to(player.id).emit('round_started', {
        roundNumber: room.roundNumber,
        yourColor: room.colorAssignments[player.id],
        totalPlayers: room.players.length,
        players: room.players.map(p => ({ id: p.id, name: p.name, avatarColor: p.avatarColor })),
        lockedUntil: room.roundLockedUntil,
        hintsUsed: player.hintsUsed || 0
      });
    });

    console.log(`Round ${room.roundNumber} started in ${roomCode}: ${char.name} (difficulty ${char.difficulty})`);
  });

  socket.on('submit_guess', ({ roomCode, guess }) => {
    const room = rooms.get(roomCode);
    if (!room || room.state !== 'playing') return;

    const char = room.currentCharacter;
    const normalizedGuess = (guess || '').trim().toLowerCase().replace(/\s+/g, ' ').trim();
    const isCorrect = char.acceptedNames.some(
      n => n.toLowerCase() === normalizedGuess
    );

    if (isCorrect) {
      const winner = room.players.find(p => p.id === socket.id);
      if (winner) winner.score++;
      room.state = 'round_end';
      if (room.autoHintTimer) { clearTimeout(room.autoHintTimer); room.autoHintTimer = null; }

      io.to(roomCode).emit('round_ended', {
        winner: winner ? { id: winner.id, name: winner.name, avatarColor: winner.avatarColor } : null,
        character: char,
        scores: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatarColor: p.avatarColor,
          score: p.score,
          isHost: p.isHost
        }))
      });
      console.log(`${winner?.name} won round ${room.roundNumber} with "${guess}"`);
    } else {
      socket.emit('wrong_guess', { guess });
    }
  });

  socket.on('skip_guess', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.state !== 'playing') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player || player.skipped) return;
    player.skipped = true;

    const allSkipped = room.players.every(p => p.skipped);
    if (allSkipped) {
      room.state = 'round_end';
      if (room.autoHintTimer) { clearTimeout(room.autoHintTimer); room.autoHintTimer = null; }
      io.to(roomCode).emit('round_ended', {
        winner: null,
        character: room.currentCharacter,
        scores: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatarColor: p.avatarColor,
          score: p.score,
          isHost: p.isHost
        }))
      });
    } else {
      io.to(roomCode).emit('player_skipped', {
        playerId: socket.id,
        playerName: player.name,
        skippedCount: room.players.filter(p => p.skipped).length,
        totalCount: room.players.length
      });
    }
  });

  socket.on('request_hint', ({ roomCode }) => {
    const room = rooms.get(roomCode);
    if (!room || room.state !== 'playing') return;
    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;
    if (player.hintsUsed >= 3) {
      socket.emit('hint_error', { message: 'No hints remaining' });
      return;
    }
    player.hintsUsed++;
    if (!room.hintRevealed) {
      room.hintRevealed = true;
      io.to(roomCode).emit('hint_revealed', {
        hint: room.currentCharacter.hint,
        auto: false,
        requestedBy: player.name,
        hintsRemaining: 3 - player.hintsUsed
      });
    } else {
      socket.emit('hint_count_updated', { hintsRemaining: 3 - player.hintsUsed });
    }
  });

  socket.on('switch_theme', ({ roomCode, theme }) => {
    const room = rooms.get(roomCode);
    if (!room || room.host !== socket.id) return;
    if (!themes[theme]) return;
    // Allow switching in any state; takes effect on the next round
    room.theme = theme;
    room.usedCharacterIds.clear();
    io.to(roomCode).emit('theme_switched', { theme, room: sanitizeRoom(room) });
    console.log(`Room ${roomCode} theme switched to ${theme}`);
  });

  socket.on('rejoin_room', ({ roomCode, playerName, avatarColor }) => {
    const code = (roomCode || '').trim();
    const room = rooms.get(code);
    if (!room) {
      socket.emit('rejoin_error', { message: 'Room not found or expired.' });
      return;
    }
    const nameKey = (playerName || '').toLowerCase().trim();
    const saved = room.disconnectedPlayers.get(nameKey);
    if (!saved) {
      socket.emit('rejoin_error', { message: 'Could not find your session. Try joining as a new player.' });
      return;
    }
    // Cancel the cleanup timer
    if (saved.cleanupTimer) clearTimeout(saved.cleanupTimer);
    room.disconnectedPlayers.delete(nameKey);

    const restoredPlayer = {
      id: socket.id,
      name: playerName,
      avatarColor: avatarColor || saved.avatarColor,
      score: saved.score,
      isHost: saved.isHost,
      skipped: false,
      hintsUsed: saved.hintsUsed || 0
    };
    if (saved.isHost) room.host = socket.id;
    room.players.push(restoredPlayer);
    socket.join(code);
    socket.data.roomCode = code;

    socket.emit('rejoined_room', {
      roomCode: code,
      room: sanitizeRoom(room),
      isHost: saved.isHost,
      gamePhase: room.state
    });

    // If mid-game, re-send round info with their color
    if (room.state === 'playing' && room.currentCharacter) {
      const color = room.colorAssignmentsByName[playerName] ||
        room.currentCharacter.colors[room.players.length % room.currentCharacter.colors.length];
      room.colorAssignments[socket.id] = color;
      room.colorAssignmentsByName[playerName] = color;
      socket.emit('round_started', {
        roundNumber: room.roundNumber,
        yourColor: color,
        totalPlayers: room.players.length,
        players: room.players.map(p => ({ id: p.id, name: p.name, avatarColor: p.avatarColor })),
        lockedUntil: 0,
        hintsUsed: restoredPlayer.hintsUsed
      });
      if (room.hintRevealed) {
        socket.emit('hint_revealed', { hint: room.currentCharacter.hint, auto: true });
      }
    }

    socket.to(code).emit('player_joined', { room: sanitizeRoom(room) });
    console.log(`${playerName} rejoined room ${code} with score ${saved.score}`);
  });

  socket.on('update_profile', ({ roomCode, name, avatarColor }) => {
    const room = rooms.get(roomCode);
    if (!room) return;
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      if (name !== undefined) player.name = name;
      if (avatarColor !== undefined) player.avatarColor = avatarColor;
      io.to(roomCode).emit('player_updated', { room: sanitizeRoom(room) });
    }
  });

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    const idx = room.players.findIndex(p => p.id === socket.id);
    if (idx === -1) return;

    const player = room.players[idx];
    const wasHost = player.isHost;

    // Save player data for potential rejoin (60 second grace period)
    const nameKey = player.name.toLowerCase().trim();
    const cleanupTimer = setTimeout(() => {
      room.disconnectedPlayers.delete(nameKey);
      if (room.players.length === 0 && room.disconnectedPlayers.size === 0) {
        rooms.delete(roomCode);
        console.log(`Room ${roomCode} closed (no reconnects)`);
      }
    }, 60000);
    room.disconnectedPlayers.set(nameKey, {
      score: player.score,
      avatarColor: player.avatarColor,
      isHost: wasHost,
      hintsUsed: player.hintsUsed || 0,
      cleanupTimer
    });

    room.players.splice(idx, 1);

    if (room.players.length === 0) {
      console.log(`Room ${roomCode} empty, holding for 60s reconnect window`);
      io.to(roomCode).emit('player_left', { room: sanitizeRoom(room) });
      return;
    }

    if (wasHost) {
      room.host = room.players[0].id;
      room.players[0].isHost = true;
    }

    if (room.state === 'playing' && room.players.every(p => p.skipped)) {
      room.state = 'round_end';
      if (room.autoHintTimer) { clearTimeout(room.autoHintTimer); room.autoHintTimer = null; }
      io.to(roomCode).emit('round_ended', {
        winner: null,
        character: room.currentCharacter,
        scores: room.players.map(p => ({
          id: p.id,
          name: p.name,
          avatarColor: p.avatarColor,
          score: p.score,
          isHost: p.isHost
        }))
      });
      return;
    }

    io.to(roomCode).emit('player_left', { room: sanitizeRoom(room) });
    console.log(`Player left room ${roomCode}, ${room.players.length} remaining`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🎮 Themed Hue's server running at http://localhost:${PORT}`);
});
