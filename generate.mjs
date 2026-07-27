import fs from 'fs';

const USERNAME = 'Aaditya-Pratap-Singh';
const TOKEN = process.env.GH_TOKEN;

async function fetchRealGraphQLContributions() {
  if (!TOKEN) {
    console.error('Error: GH_TOKEN environment variable is missing!');
    return;
  }

  console.log(`Fetching REAL GitHub contribution calendar for ${USERNAME}...`);

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js'
      },
      body: JSON.stringify({ query, variables: { username: USERNAME } })
    });

    const result = await response.json();
    if (result.errors) {
      console.error('GitHub API Error:', result.errors);
      return;
    }

    const weeks = result.data.user.contributionsCollection.contributionCalendar.weeks;
    const recentWeeks = weeks.slice(-48); // Full width 48 weeks

    let gridSvg = '';
    recentWeeks.forEach((week, col) => {
      week.contributionDays.forEach((day, row) => {
        const x = col * 15.5;
        const y = row * 15.5;
        
        const isGreen = day.contributionCount > 0;
        const pulse = isGreen 
          ? `<animate attributeName="fill-opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />` 
          : '';

        gridSvg += `<rect x="${x}" y="${y}" width="12" height="12" fill="${day.color}" rx="2">\n${pulse}\n</rect>\n`;
      });
    });

    const svgContent = `
<svg width="800" height="230" viewBox="0 0 800 230" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>

  <text x="25" y="28" fill="#58a6ff" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold">
    👾 ${USERNAME}'s Real Contribution Shooter
  </text>

  <!-- Real Heatmap Grid -->
  <g transform="translate(25, 40)">
    ${gridSvg}
  </g>

  <!-- Jet Shooter placed with GAP at Y: 195 -->
  <g transform="translate(0, 195)">
    <!-- Smooth Horizontal Flight -->
    <animateTransform 
      attributeName="transform" 
      type="translate" 
      values="25,195; 730,195; 25,195" 
      dur="12s" 
      repeatCount="indefinite" 
    />

    <!-- Moving Arcade Bullets -->
    <!-- Bullet 1 -->
    <rect x="11" y="-8" width="3" height="12" fill="#39d353" rx="1">
      <animate attributeName="y" values="-8;-145;-8" dur="0.7s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.7s" repeatCount="indefinite" />
    </rect>

    <!-- Bullet 2 -->
    <rect x="11" y="-8" width="3" height="12" fill="#79c0ff" rx="1">
      <animate attributeName="y" values="-8;-145;-8" dur="0.7s" begin="0.25s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.7s" begin="0.25s" repeatCount="indefinite" />
    </rect>

    <!-- Bullet 3 -->
    <rect x="11" y="-8" width="3" height="12" fill="#ff7b72" rx="1">
      <animate attributeName="y" values="-8;-145;-8" dur="0.7s" begin="0.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.7s" begin="0.5s" repeatCount="indefinite" />
    </rect>

    <!-- Upward Facing Jet -->
    <path d="M 12 -12 L 20 6 L 15 4 L 12 10 L 9 4 L 4 6 Z" fill="#58a6ff" stroke="#1f6feb" stroke-width="1.5" />
    <polygon points="10,10 12,16 14,10" fill="#ff7b72" />
  </g>
</svg>
    `.trim();

    fs.writeFileSync('dark.svg', svgContent);
    fs.writeFileSync('light.svg', svgContent);
    console.log('SUCCESS! Perfect spacing, full width graph & bullets generated!');

  } catch (err) {
    console.error('Execution Failed:', err);
  }
}

fetchRealGraphQLContributions();