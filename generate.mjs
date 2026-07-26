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
    const recentWeeks = weeks.slice(-38);

    let gridSvg = '';
    recentWeeks.forEach((week, col) => {
      week.contributionDays.forEach((day, row) => {
        const x = col * 15;
        const y = row * 15;
        
        // Active contributions par hit effect / glow Pulse
        const isContribution = day.contributionCount > 0;
        const animateEffect = isContribution ? `
          <animate attributeName="opacity" values="0.4;1;0.4" dur="${(1.5 + Math.random()).toFixed(1)}s" repeatCount="indefinite" />
        ` : '';

        gridSvg += `<rect x="${x}" y="${y}" width="12" height="12" fill="${day.color}" rx="2">\n${animateEffect}</rect>\n`;
      });
    });

    // Slow movement + Upward hit animation
    const svgContent = `
<svg width="800" height="260" viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>

  <text x="30" y="32" fill="#58a6ff" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold">
    👾 ${USERNAME}'s Real Contribution Shooter
  </text>

  <!-- Real Heatmap Grid with Glowing Hit Effects -->
  <g transform="translate(30, 50)">
    ${gridSvg}
  </g>

  <!-- Slow Jet Flight + Deep Hit Lasers -->
  <g transform="translate(0, 205)">
    <!-- SLOW Horizontal Movement (14s) -->
    <animateTransform 
      attributeName="transform" 
      type="translate" 
      values="30,205; 550,205; 30,205" 
      dur="14s" 
      repeatCount="indefinite" 
    />

    <!-- Laser Beam 1 (Hits deep into grid) -->
    <rect x="11" y="-10" width="3" height="22" fill="#39d353" rx="1">
      <animate attributeName="y" values="-10;-155;-10" dur="0.8s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
    </rect>

    <!-- Laser Beam 2 -->
    <rect x="11" y="-10" width="3" height="22" fill="#79c0ff" rx="1">
      <animate attributeName="y" values="-10;-155;-10" dur="0.8s" begin="0.25s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.8s" begin="0.25s" repeatCount="indefinite" />
    </rect>

    <!-- Laser Beam 3 -->
    <rect x="11" y="-10" width="3" height="22" fill="#ff7b72" rx="1">
      <animate attributeName="y" values="-10;-155;-10" dur="0.8s" begin="0.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.8s" begin="0.5s" repeatCount="indefinite" />
    </rect>

    <!-- Upward Facing Jet -->
    <path d="M 12 -14 L 21 6 L 16 4 L 12 11 L 8 4 L 3 6 Z" fill="#58a6ff" stroke="#1f6feb" stroke-width="1.5" />
    <polygon points="10,11 12,18 14,11" fill="#ff7b72" />
  </g>
</svg>
    `.trim();

    fs.writeFileSync('dark.svg', svgContent);
    fs.writeFileSync('light.svg', svgContent);
    console.log('SUCCESS! Slow speed + Hit effect version generated!');

  } catch (err) {
    console.error('Execution Failed:', err);
  }
}

fetchRealGraphQLContributions();