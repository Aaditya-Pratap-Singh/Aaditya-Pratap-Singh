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
        gridSvg += `<rect x="${x}" y="${y}" width="12" height="12" fill="${day.color}" rx="2" />\n`;
      });
    });

    const svgContent = `
<svg width="800" height="220" viewBox="0 0 800 220" xmlns="http://www.w3.org/2000/svg">
  <style>
    .jet-group { animation: flyAround 7s linear infinite alternate; }
    .bullet-1 { animation: shootUp 0.6s linear infinite; }
    .bullet-2 { animation: shootUp 0.6s linear infinite 0.2s; }
    .bullet-3 { animation: shootUp 0.6s linear infinite 0.4s; }

    @keyframes flyAround {
      0% { transform: translateX(20px); }
      100% { transform: translateX(530px); }
    }

    @keyframes shootUp {
      0% { transform: translateY(0px); opacity: 1; }
      100% { transform: translateY(-110px); opacity: 0; }
    }
  </style>

  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>

  <text x="30" y="28" fill="#58a6ff" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold">
    🚀 ${USERNAME}'s Real Contribution Shooter
  </text>

  <!-- Real Heatmap Grid -->
  <g transform="translate(30, 42)">
    ${gridSvg}
  </g>

  <!-- Firing Jet at Bottom -->
  <g class="jet-group" transform="translate(0, 180)">
    <!-- Upward Lasers -->
    <rect class="bullet-1" x="11" y="-8" width="3" height="14" fill="#ff7b72" rx="1" />
    <rect class="bullet-2" x="11" y="-8" width="3" height="14" fill="#38d39f" rx="1" />
    <rect class="bullet-3" x="11" y="-8" width="3" height="14" fill="#79c0ff" rx="1" />

    <!-- Space Shooter Jet -->
    <path d="M 12 -12 L 20 6 L 15 4 L 12 10 L 9 4 L 4 6 Z" fill="#58a6ff" stroke="#1f6feb" stroke-width="1.5" />
    <polygon points="10,10 12,16 14,10" fill="#ff7b72" />
  </g>
</svg>
    `.trim();

    fs.writeFileSync('dark.svg', svgContent);
    fs.writeFileSync('light.svg', svgContent);
    console.log('PERFECT! Updated shooter animation generated!');

  } catch (err) {
    console.error('Execution Failed:', err);
  }
}

fetchRealGraphQLContributions();