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
    // 44 weeks for full width graph
    const recentWeeks = weeks.slice(-44);

    let gridSvg = '';
    recentWeeks.forEach((week, col) => {
      week.contributionDays.forEach((day, row) => {
        const x = col * 16;
        const y = row * 16;
        
        const isGreen = day.contributionCount > 0;
        const pulse = isGreen 
          ? `<animate attributeName="fill-opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />` 
          : '';

        gridSvg += `<rect x="${x}" y="${y}" width="13" height="13" fill="${day.color}" rx="2">\n${pulse}\n</rect>\n`;
      });
    });

    const svgContent = `
<svg width="800" height="210" viewBox="0 0 800 210" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117" rx="10"/>

  <text x="25" y="28" fill="#58a6ff" font-family="Segoe UI, sans-serif" font-size="14" font-weight="bold">
    👾 ${USERNAME}'s Real Contribution Shooter
  </text>

  <!-- Full Width Heatmap Grid -->
  <g transform="translate(25, 40)">
    ${gridSvg}
  </g>

  <!-- Moving Jet + Laser Blast Hit Effect -->
  <g transform="translate(0, 165)">
    <!-- Smooth Horizontal Flight -->
    <animateTransform 
      attributeName="transform" 
      type="translate" 
      values="25,165; 690,165; 25,165" 
      dur="12s" 
      repeatCount="indefinite" 
    />

    <!-- Upward Firing Lasers Hitting Heatmap -->
    <rect x="10" y="-110" width="3" height="110" fill="#39d353" opacity="0.8">
      <animate attributeName="opacity" values="0.2;1;0.2" dur="0.3s" repeatCount="indefinite" />
      <animate attributeName="height" values="20;110;20" dur="0.5s" repeatCount="indefinite" />
    </rect>

    <!-- Impact Spark at Hit Point -->
    <circle cx="11" cy="-110" r="5" fill="#39d353">
      <animate attributeName="r" values="2;6;2" dur="0.3s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0.3;1" dur="0.3s" repeatCount="indefinite" />
    </circle>

    <!-- Upward Facing Fighter Jet -->
    <path d="M 11 -12 L 19 6 L 15 4 L 11 10 L 7 4 L 3 6 Z" fill="#58a6ff" stroke="#1f6feb" stroke-width="1.5" />
    <polygon points="9,10 11,16 13,10" fill="#ff7b72" />
  </g>
</svg>
    `.trim();

    fs.writeFileSync('dark.svg', svgContent);
    fs.writeFileSync('light.svg', svgContent);
    console.log('SUCCESS! Full width shooter graph generated!');

  } catch (err) {
    console.error('Execution Failed:', err);
  }
}

fetchRealGraphQLContributions();