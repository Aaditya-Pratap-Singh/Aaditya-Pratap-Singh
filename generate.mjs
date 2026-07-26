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

    // Native SVG SMIL Animations (Compatible with GitHub Markdown Image Rendering)
    const svgContent = `
<svg width="800" height="260" viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>

  <text x="30" y="32" fill="#58a6ff" font-family="Segoe UI, sans-serif" font-size="15" font-weight="bold">
    👾 ${USERNAME}'s Real Contribution Shooter
  </text>

  <!-- Real Heatmap Grid -->
  <g transform="translate(30, 50)">
    ${gridSvg}
  </g>

  <!-- Moving Jet + Laser Firing System -->
  <g transform="translate(0, 210)">
    <!-- Horizontal Movement for Entire Shooter -->
    <animateTransform 
      attributeName="transform" 
      type="translate" 
      values="30,210; 550,210; 30,210" 
      dur="7s" 
      repeatCount="indefinite" 
    />

    <!-- Laser Beam 1 -->
    <rect x="11" y="-10" width="3" height="18" fill="#ff7b72" rx="1">
      <animate attributeName="y" values="-10;-150;-10" dur="0.6s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.6s" repeatCount="indefinite" />
    </rect>

    <!-- Laser Beam 2 -->
    <rect x="11" y="-10" width="3" height="18" fill="#38d39f" rx="1">
      <animate attributeName="y" values="-10;-150;-10" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.6s" begin="0.2s" repeatCount="indefinite" />
    </rect>

    <!-- Laser Beam 3 -->
    <rect x="11" y="-10" width="3" height="18" fill="#79c0ff" rx="1">
      <animate attributeName="y" values="-10;-150;-10" dur="0.6s" begin="0.4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0;1" dur="0.6s" begin="0.4s" repeatCount="indefinite" />
    </rect>

    <!-- Upward Facing Jet Plane -->
    <path d="M 12 -14 L 21 6 L 16 4 L 12 11 L 8 4 L 3 6 Z" fill="#58a6ff" stroke="#1f6feb" stroke-width="1.5" />
    <polygon points="10,11 12,18 14,11" fill="#ff7b72" />
  </g>
</svg>
    `.trim();

    fs.writeFileSync('dark.svg', svgContent);
    fs.writeFileSync('light.svg', svgContent);
    console.log('SUCCESS! Native SVG SMIL animation generated successfully!');

  } catch (err) {
    console.error('Execution Failed:', err);
  }
}

fetchRealGraphQLContributions();