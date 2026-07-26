import fs from 'fs';

const USERNAME = 'Aaditya-Pratap-Singh';
// Read token securely from environment variable instead of hardcoding
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
                date
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
    const recentWeeks = weeks.slice(-36);

    let gridSvg = '';
    recentWeeks.forEach((week, col) => {
      week.contributionDays.forEach((day, row) => {
        const x = col * 15;
        const y = row * 15;
        gridSvg += `<rect x="${x}" y="${y}" width="12" height="12" fill="${day.color}" rx="2" />\n`;
      });
    });

    const svgContent = `
<svg width="800" height="230" viewBox="0 0 800 230" xmlns="http://www.w3.org/2000/svg">
  <style>
    .jet-container { animation: moveJet 6s ease-in-out infinite alternate; }
    .bullet { animation: fireUp 0.8s linear infinite; }
    .b1 { animation-delay: 0s; }
    .b2 { animation-delay: 0.25s; }
    .b3 { animation-delay: 0.5s; }
    @keyframes moveJet {
      0% { transform: translateX(30px); }
      100% { transform: translateX(720px); }
    }
    @keyframes fireUp {
      0% { transform: translateY(0px); opacity: 1; }
      100% { transform: translateY(-130px); opacity: 0; }
    }
  </style>

  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>

  <text x="30" y="30" fill="#58a6ff" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold">
    👾 ${USERNAME}'s Real Contribution Shooter
  </text>

  <g transform="translate(30, 45)">
    ${gridSvg}
  </g>

  <g class="jet-container" transform="translate(0, 185)">
    <rect class="bullet b1" x="11" y="-10" width="3" height="12" fill="#ff7b72" rx="1" />
    <rect class="bullet b2" x="11" y="-10" width="3" height="12" fill="#38d39f" rx="1" />
    <rect class="bullet b3" x="11" y="-10" width="3" height="12" fill="#79c0ff" rx="1" />
    <path d="M 12 -12 L 20 8 L 15 6 L 12 12 L 9 6 L 4 8 Z" fill="#58a6ff" stroke="#1f6feb" stroke-width="1.5" />
    <polygon points="10,12 12,17 14,12" fill="#ff7b72" />
  </g>
</svg>
    `.trim();

    fs.writeFileSync('dark.svg', svgContent);
    fs.writeFileSync('light.svg', svgContent);
    console.log('SUCCESS! Real GitHub Contributions fetched and Jet Heatmap generated!');

  } catch (err) {
    console.error('Execution Failed:', err);
  }
}

fetchRealGraphQLContributions();