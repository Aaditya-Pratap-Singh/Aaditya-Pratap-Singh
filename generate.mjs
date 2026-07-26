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

    // Height increased to 280 to place jet properly BELOW the grid
    const svgContent = `
<svg width="800" height="280" viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg">
  <style>
    .jet-group { animation: flyAround 8s linear infinite alternate; }
    .bullet-1 { animation: shootUp 0.7s linear infinite; }
    .bullet-2 { animation: shootUp 0.7s linear infinite 0.25s; }
    .bullet-3 { animation: shootUp 0.7s linear infinite 0.5s; }

    @keyframes flyAround {
      0% { transform: translateX(30px); }
      100% { transform: translateX(540px); }
    }

    @keyframes shootUp {
      0% { transform: translateY(0px); opacity: 1; }
      100% { transform: translateY(-160px); opacity: 0; }
    }
  </style>

  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>

  <text x="30" y="32" fill="#58a6ff" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold">
    👾 ${USERNAME}'s Real Contribution Shooter
  </text>

  <!-- Real Heatmap Grid (Placed at Y: 50) -->
  <g transform="translate(30, 50)">
    ${gridSvg}
  </g>

  <!-- Jet Shooter Placed at Bottom (Y: 230) -->
  <g class="jet-group" transform="translate(0, 230)">
    <!-- Upward Lasers -->
    <rect class="bullet-1" x="11" y="-10" width="3" height="16" fill="#ff7b72" rx="1" />
    <rect class="bullet-2" x="11" y="-10" width="3" height="16" fill="#38d39f" rx="1" />
    <rect class="bullet-3" x="11" y="-10" width="3" height="16" fill="#79c0ff" rx="1" />

    <!-- Upward Facing Jet -->
    <path d="M 12 -14 L 21 6 L 16 4 L 12 11 L 8 4 L 3 6 Z" fill="#58a6ff" stroke="#1f6feb" stroke-width="1.5" />
    <polygon points="10,11 12,18 14,11" fill="#ff7b72" />
  </g>
</svg>
    `.trim();

    fs.writeFileSync('dark.svg', svgContent);
    fs.writeFileSync('light.svg', svgContent);
    console.log('SUCCESS! Jet repositioned below the grid.');

  } catch (err) {
    console.error('Execution Failed:', err);
  }
}

fetchRealGraphQLContributions();