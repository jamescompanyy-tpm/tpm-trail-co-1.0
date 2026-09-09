/* ═══════════════════════════════════════════════════
   TPM TRAIL CO. — blog.js
   Post data · rendering · filtering ·
   article modal · newsletter · CMS fetch
═══════════════════════════════════════════════════ */

// ── post data ──
const POSTS = [
  {
    id: 1,
    featured: true,
    title: "The Forgotten History of the Blue Hills Reservation",
    category: "Trail Stories",
    date: "May 12, 2026",
    readTime: "7 min read",
    author: "James Rivera",
    excerpt: "Before it was a state park, before the reservation boundary lines were drawn, the Blue Hills were sacred ground. Here's what most hikers never know about the land beneath their feet.",
    tags: ["Trail History", "Indigenous History", "Blue Hills"],
    gradient: "linear-gradient(135deg, #1c3a28 0%, #2d5a3d 40%, #4a7c59 100%)",
    body: `
      <p>Most hikers who lace up their boots at the Blue Hills Reservation trailhead are thinking about the summit. The view from Great Blue Hill at 635 feet is, rightfully, the draw — on a clear day you can see all the way to the Atlantic. But the ground you walk on carries a story far older than any trail map.</p>

      <h3>The Massachusett People</h3>
      <p>The Blue Hills were home to the Massachusett people for thousands of years before European contact. The name "Massachusetts" itself derives from the Algonquian word Massachusett, meaning "at the great hill" — a direct reference to the Blue Hills. This was not a peripheral landmark. It was a center of their world.</p>
      <blockquote>"The land remembers what the maps forget."</blockquote>
      <p>The Massachusett used the hills for hunting, ceremony, and as a geographic anchor for navigation across the coastal plain. The summit of Great Blue Hill was a place of orientation — from it, you could see the harbor, the marshes, the inland forests. It was, in the truest sense, a place where the people knew where they were.</p>

      <h3>What Changed</h3>
      <p>European settlement in the 1620s and 1630s brought rapid displacement. By the time the reservation was formally established in 1893, the Massachusett had been systematically removed from their ancestral territories through a combination of colonial land grants, violent conflict during King Philip's War (1675–1676), and forced assimilation policies.</p>
      <p>The trails we hike today often follow paths that were walked for millennia before they had names on a Massachusetts DCR map. The Skyline Trail. The Wolcott Path. The North Border Loop. Many of these routes trace old movement corridors through the hills — ways the land naturally wants to be traveled.</p>

      <h3>What You Can Do</h3>
      <p>The next time you summit Great Blue Hill, take a moment before the view pulls you in. Stand at the top and consider: this place was a center for a people who understood it far more deeply than we do. Walk with that awareness.</p>
      <ul>
        <li>Learn about the Massachusett Tribe at Ponkapoag — they maintain a presence at the reservation to this day</li>
        <li>Visit the Blue Hills Trailside Museum, which has exhibits on the area's Indigenous history</li>
        <li>Practice the Leave No Trace principles that the Massachusett encoded into their relationship with this land for generations</li>
      </ul>
      <p>The trail is not neutral ground. It is storied ground. And it is richer for knowing that story.</p>
    `
  },
  {
    id: 2,
    featured: false,
    title: "5 Plants You Walk Past That Are Actually Medicine",
    category: "Ecology",
    date: "May 6, 2026",
    readTime: "5 min read",
    author: "James Rivera",
    excerpt: "The trail is a pharmacy. Yarrow stops bleeding. Plantain pulls splinters. You've been walking past a medicine cabinet every time you hike. Here's what to look for.",
    tags: ["Plant Medicine", "Foraging", "Ecology"],
    gradient: "linear-gradient(135deg, #2d5a3d 0%, #4a7c59 60%, #7aaa85 100%)",
    body: `
      <p>The name TPM Trail Co. — The People's Medicine — isn't just a brand. It's a worldview. The idea that nature holds what we need, if we know where to look, is as old as human presence on this continent. Here are five plants you almost certainly walk past on every New England hike.</p>

      <h3>1. Yarrow (Achillea millefolium)</h3>
      <p>Feathery, fern-like leaves and flat-topped white or pale pink flower clusters. Found in open fields and trail edges from May through September. Yarrow has been used for wound care across cultures for at least 60,000 years — Neanderthal burial sites have been found with yarrow pollen. Crush the leaves and apply directly to a cut to slow bleeding. It is a genuine, documented hemostatic agent.</p>

      <h3>2. Common Plantain (Plantago major)</h3>
      <p>Not the banana — this is a low-growing rosette with parallel-veined oval leaves. It grows in almost every disturbed soil environment, including trailheads and parking areas. Plantain is anti-inflammatory and antimicrobial. Chew a leaf into a paste and apply to bee stings, splinters, or minor skin irritation for real, measurable relief.</p>

      <h3>3. Wood Sorrel (Oxalis acetosella)</h3>
      <blockquote>"If it tastes like lemon, you found it."</blockquote>
      <p>Heart-shaped trifoliate leaves, often found in shaded forest understory. Tastes pleasantly tart — that's oxalic acid, the same compound in spinach. Rich in Vitamin C. Used historically by Indigenous peoples and early colonists to prevent scurvy. A small handful is a genuine trail snack. (Note: avoid in very large quantities if you have kidney issues.)</p>

      <h3>4. Stinging Nettle (Urtica dioica)</h3>
      <p>You know this one because you've walked into it. The sting is caused by tiny silica needles injecting formic acid into skin. But nettle is one of the most nutritious plants in the northeastern forest — boiling or drying removes the sting entirely. Historically boiled as a spring green, used for iron deficiency, and even applied topically as a counterirritant therapy for arthritic joints.</p>

      <h3>5. St. John's Wort (Hypericum perforatum)</h3>
      <p>Bright yellow five-petaled flowers with tiny black dots on the edges, blooming mid-summer in open sunny spots along trails. Hold a leaf up to the light — you'll see translucent dots. Those are oil glands. St. John's Wort has documented mild antidepressant effects and is used topically as an anti-inflammatory oil for bruises and nerve pain. It is one of the most studied medicinal herbs in the world.</p>

      <p>The trail is a pharmacy. Walk it with open eyes.</p>
    `
  },
  {
    id: 3,
    featured: false,
    title: "What to Wear on a New England Hike: The Honest List",
    category: "Gear",
    date: "April 28, 2026",
    readTime: "4 min read",
    author: "James Rivera",
    excerpt: "You don't need $400 boots to hike New England. Here's what actually matters, what's optional, and what I see beginners get wrong every single season.",
    tags: ["Gear", "Beginner Tips", "Layering"],
    gradient: "linear-gradient(135deg, #3d2b1f 0%, #6b4c35 50%, #c4956a 100%)",
    body: `
      <p>Every season I meet first-time hikers who've spent $800 on gear and forgotten to bring water. And I meet others who show up in jeans and conquer a 10-mile ridge without complaint. Here's the honest, no-fluff guide to what you actually need on a New England trail.</p>

      <h3>The Non-Negotiables</h3>
      <ul>
        <li><strong>Water:</strong> Minimum 2 liters for a half-day hike. This is the single most common mistake. Every time.</li>
        <li><strong>Footwear with grip:</strong> Trail runners or hiking boots. Not sneakers on wet rock. Not sandals.</li>
        <li><strong>A rain layer:</strong> New England weather changes in 20 minutes. A packable rain jacket weighs nothing.</li>
        <li><strong>Snacks:</strong> Something with real calories. Trail mix, energy bars, a sandwich. Your body will thank you above 1,000 feet.</li>
        <li><strong>Charged phone:</strong> With the AllTrails app downloaded offline for your trail.</li>
      </ul>

      <h3>The Layering System (For Shoulder Seasons)</h3>
      <p>New England spring and fall require the ability to add and remove layers as you move. The system is simple:</p>
      <ul>
        <li><strong>Base layer:</strong> Moisture-wicking. Not cotton. Cotton holds sweat and gets cold fast.</li>
        <li><strong>Mid layer:</strong> A fleece or light insulating jacket. Pack it, don't wear it.</li>
        <li><strong>Outer layer:</strong> Wind and rain resistant. Doesn't need to be expensive.</li>
      </ul>

      <h3>What's Actually Optional</h3>
      <p>Trekking poles are wonderful but not necessary. A $400 technical pack is not needed for a day hike — a basic 20L daypack works perfectly. Gaiters are great for mud season but not essential otherwise. Expensive merino wool base layers are luxurious, but mid-tier synthetics work fine.</p>

      <blockquote>"The best gear is the gear you actually bring. A cheap rain jacket in your pack beats an expensive one at home."</blockquote>

      <h3>One Honest Note on Boots</h3>
      <p>If you're buying your first hiking boots: spend $80–$120, not $400. You need boots that fit, are broken in before the hike, and have a lugged rubber sole. That's it. You will figure out what features you actually want after a season of hiking. Don't let gear be the barrier to getting on the trail.</p>

      <p>See you out there.</p>
    `
  },
  {
    id: 4,
    featured: false,
    title: "A Trip Report: Sunrise on Mount Monadnock",
    category: "Trail Stories",
    date: "April 18, 2026",
    readTime: "6 min read",
    author: "James Rivera",
    excerpt: "We left the trailhead at 4:45am. By the time the summit came into view, the sky was doing something I'd only seen in paintings. Here's the full trip report from our April sunrise hike.",
    tags: ["Trip Report", "Monadnock", "Sunrise"],
    gradient: "linear-gradient(135deg, #0d2018 0%, #1c3a28 40%, #4a7c59 100%)",
    body: `
      <p>The alarm went off at 3:30am. Four people in the group. Everyone showed up. That alone felt like a good sign.</p>

      <h3>The Approach</h3>
      <p>We parked at the White Dot Trail trailhead in Jaffrey, New Hampshire at 4:45am. The temperature was 34°F. Headlamps on, layers tight, we moved into the dark forest in single file. Mount Monadnock is a paradox — at 3,165 feet it's not technically a high mountain, but it is one of the most climbed mountains in the world. The White Dot Trail earns that status. It's relentless.</p>
      <p>The first mile through the forest was quiet in the way only pre-dawn hiking can be. No other parties. Just the sound of boots on root and rock, and somewhere far off, a barred owl finishing its night.</p>

      <h3>The Treeline</h3>
      <p>Monadnock's treeline breaks at around 2,500 feet — unusually low for its elevation. This is the result of massive forest fires in the early 1800s, deliberately set by settlers trying to eliminate wolf habitat. The fires burned so hot they destroyed the soil layer, and the summit zone has never fully recovered. What looks like natural alpine terrain is, in part, a 200-year-old ecological wound.</p>
      <blockquote>"The mountain holds the memory of fire. You can feel it in the exposed rock."</blockquote>

      <h3>The Summit</h3>
      <p>We reached the summit at 6:22am. The sky to the east was already transitioning — deep indigo giving way to bands of amber and rose. We sat on the summit rocks in complete silence and watched the sun lift above the horizon over southern New Hampshire.</p>
      <p>One member of the group, who had told me at the trailhead that she "wasn't really a hiker," sat completely still for ten minutes just looking. When she finally spoke, she said: "I didn't know it could look like that."</p>
      <p>That's why I do this work.</p>

      <h3>The Descent</h3>
      <p>We took the White Cross Trail down, which adds distance but rewards with better views back across the summit cone. Back at the trailhead by 9:15am. Total time: 4.5 hours. Difficulty: moderate. Reward: incalculable.</p>
      <p>Monadnock sunrise hikes run with TPM in late April through June. Spots are limited to 6 per group. If this sounds like your kind of morning, you know where to find me.</p>
    `
  },
  {
    id: 5,
    featured: false,
    title: "The Geology Beneath Your Boots",
    category: "Ecology",
    date: "April 8, 2026",
    readTime: "5 min read",
    author: "James Rivera",
    excerpt: "The rocks on a New England summit are 400 million years old. The glacier that carved the ridgeline? Gone for 10,000 years. Here's how to read the deep time written into the landscape.",
    tags: ["Geology", "Deep Time", "Ecology"],
    gradient: "linear-gradient(135deg, #4a7c59 0%, #7aaa85 50%, #b5cdb8 100%)",
    body: `
      <p>Pick up a rock on any New England trail. It is older than the dinosaurs. It existed before the Atlantic Ocean. The mountain you're climbing was once as tall as the Himalayas. Here's how to read that story in the landscape around you.</p>

      <h3>Schist: The Foundation</h3>
      <p>Much of New England's bedrock is schist — a metamorphic rock formed when ancient ocean sediments were subjected to enormous heat and pressure as continental plates collided roughly 400–500 million years ago. The shiny, flaky texture you see on exposed summit rocks is mica, one of schist's primary minerals. Those flecks of silver catch the light on granite ridges across Vermont, New Hampshire, and Massachusetts.</p>

      <h3>What the Glacier Left Behind</h3>
      <p>The last glacial maximum ended roughly 18,000 years ago. The Laurentide Ice Sheet — up to two miles thick in places — covered all of New England. As it retreated, between 10,000 and 15,000 years ago, it left behind a landscape that was essentially brand new. The U-shaped valleys, the rounded summits (called "whalebacks"), the scattered boulders sitting in impossible positions — all glacier.</p>
      <blockquote>"A glacial erratic is a boulder transported miles from its origin by ice and deposited wherever the glacier happened to melt. They sit like punctuation marks on the landscape."</blockquote>

      <h3>How to Read a Ridge</h3>
      <p>The next time you're on a ridge, look at which side is steep and which is gentle. Glaciers move in one direction. The steep side faced away from the glacier's advance (the "lee" side); the gentle side faced toward it. The glacier rode up and over the gentle slope and plucked rock from the steep side as it pulled away. This asymmetry is visible on dozens of New England ridges.</p>

      <h3>The Newest Thing on the Mountain</h3>
      <p>The soil. Soil formation begins after glacial retreat, built slowly from weathered rock, decomposing organic matter, and microbial activity. The thin, rocky soils of New England's high peaks represent thousands of years of ecological succession. When you step off trail and damage that soil layer, you set back a process that took millennia. Stay on the trail.</p>

      <p>The mountain is a library. Every rock is a page. Learn to read it and you'll never hike the same way again.</p>
    `
  },
  {
    id: 6,
    featured: false,
    title: "Building a 72-Hour Backpacking Kit from Scratch",
    category: "Gear",
    date: "March 29, 2026",
    readTime: "8 min read",
    author: "James Rivera",
    excerpt: "You don't need to spend $2,000 to sleep in the backcountry. Here's the honest, prioritized gear list I give every first-time backpacker — with budget notes on every item.",
    tags: ["Gear", "Backpacking", "Budget"],
    gradient: "linear-gradient(135deg, #6b4c35 0%, #c4956a 60%, #e8d5b7 100%)",
    body: `
      <p>The gear industry wants you to believe backpacking requires a $600 tent, a $400 sleep system, and a $200 pack. It doesn't. Here's the honest kit — prioritized by what actually matters for a 2–3 night trip in New England's backcountry.</p>

      <h3>The Big Three (Shelter, Sleep, Pack)</h3>
      <p>These are where weight and cost concentrate. You don't need ultralight for your first trips — you need adequate.</p>
      <ul>
        <li><strong>Tent:</strong> A freestanding 2-person tent in the $120–$200 range handles New England conditions. REI Half Dome, Big Agnes Copper Spur HV2 on sale. Avoid anything under $80 — rain seams matter.</li>
        <li><strong>Sleep System:</strong> A sleeping bag rated to 20°F covers most New England three-season conditions. Pair with a foam or inflatable sleeping pad (the pad matters as much as the bag for warmth). Budget: $150–$250 total.</li>
        <li><strong>Pack:</strong> 50–65L for 2–3 nights. Osprey Atmos or Aether for fit and durability. Can be found for $150–$200 on sale. Fit matters more than brand.</li>
      </ul>

      <h3>The Kitchen</h3>
      <ul>
        <li>A canister stove and fuel ($35–$50). Jetboil or MSR PocketRocket.</li>
        <li>A 700mL titanium or aluminum pot.</li>
        <li>A long-handled spork. That's it.</li>
        <li>A water filter — Sawyer Squeeze ($35) is the best value in backpacking gear, full stop.</li>
      </ul>

      <h3>Safety Non-Negotiables</h3>
      <ul>
        <li>First aid kit with blister treatment, ibuprofen, antihistamine, ace bandage</li>
        <li>Headlamp with fresh batteries</li>
        <li>Emergency bivy (weighs 4oz, costs $20, has saved lives)</li>
        <li>Whistle, fire starter, knife</li>
        <li>Downloaded offline maps for your route</li>
      </ul>

      <blockquote>"The most important gear decision is whether you told someone exactly where you're going and when you'll be back."</blockquote>

      <h3>What to Leave at Home</h3>
      <p>Cotton anything. A hatchet (you don't need a fire every night). More than two pairs of socks (three is the max). Any electronic device you don't absolutely need. The camp chair (luxury item — earn it later).</p>

      <p>Total budget for an adequate first-time backpacking kit: $400–$650. Not $2,000. Get out there.</p>
    `
  }
];

// ── state ──
let ALL_POSTS    = [...POSTS];
let currentFilter = 'all';
let cmsLoaded    = false;

// ── helpers ──
function getCatClass(cat) {
  if (cat === 'Trail Stories') return 'cat-stories';
  if (cat === 'Ecology')       return 'cat-ecology';
  if (cat === 'Gear')          return 'cat-gear';
  return 'cat-stories';
}

// ── render featured ──
function renderFeatured(post) {
  const fc = document.getElementById('featuredContainer');
  if (!post) { fc.innerHTML = ''; return; }
  fc.innerHTML = `
    <div class="featured-post reveal" onclick="openArticle(${post.id})">
      <div class="featured-img">
        <div class="featured-img-bg" style="background:${post.gradient}"></div>
      </div>
      <div class="featured-body">
        <span class="post-category ${getCatClass(post.category)}">${post.category}</span>
        <div class="post-title">${post.title}</div>
        <p class="post-excerpt">${post.excerpt}</p>
        <div class="post-meta">
          <span class="post-author">${post.author}</span>
          <span class="post-date">${post.date}</span>
          <span class="post-read-time">${post.readTime}</span>
        </div>
        <span class="read-more">Read full post →</span>
      </div>
    </div>`;
  setTimeout(() => fc.querySelector('.reveal')?.classList.add('visible'), 50);
}

// ── render grid ──
function renderGrid(posts) {
  const grid  = document.getElementById('postsGrid');
  const empty = document.getElementById('emptyState');
  const fc    = document.getElementById('featuredContainer');

  if (posts.length === 0) {
    grid.innerHTML = '';
    fc.innerHTML   = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  const featured = currentFilter === 'all' ? posts.find(p => p.featured) : null;
  renderFeatured(featured);

  const rest = featured ? posts.filter(p => p.id !== featured.id) : posts;
  grid.innerHTML = rest.map((p, i) => `
    <div class="post-card reveal" style="transition-delay:${i * 80}ms" onclick="openArticle(${p.id})">
      <div class="card-img">
        <div class="card-img-bg" style="background:${p.gradient}"></div>
      </div>
      <div class="card-body">
        <span class="post-category ${getCatClass(p.category)}">${p.category}</span>
        <div class="post-title">${p.title}</div>
        <p class="post-excerpt">${p.excerpt}</p>
        <div class="card-footer">
          <span class="card-meta">${p.date} · ${p.readTime}</span>
          <span class="card-read">Read →</span>
        </div>
      </div>
    </div>`).join('');

  document.querySelectorAll('#postsGrid .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 60 + i * 60);
  });

  const fc2 = document.getElementById('filterCount');
  if (fc2) fc2.textContent = `${posts.length} post${posts.length !== 1 ? 's' : ''}`;
}

// ── render recent sidebar ──
function renderRecent() {
  const list = document.getElementById('recentList');
  if (!list) return;
  list.innerHTML = ALL_POSTS.slice(0, 4).map(p => `
    <li class="recent-item" onclick="openArticle(${p.id})">
      <div class="recent-thumb"><div class="recent-thumb-bg" style="background:${p.gradient}"></div></div>
      <div class="recent-info">
        <div class="recent-title">${p.title}</div>
        <div class="recent-date">${p.date}</div>
      </div>
    </li>`).join('');
}

// ── filter ──
function filterPosts(cat, btn) {
  currentFilter = cat;
  if (btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const filtered = cat === 'all' ? ALL_POSTS : ALL_POSTS.filter(p => p.category === cat);
  renderGrid(filtered);
}

// ── article modal ──
function openArticle(id) {
  const post = ALL_POSTS.find(p => p.id === id);
  if (!post) return;
  document.getElementById('articleHeroImg').style.background = post.gradient;
  document.getElementById('articleCat').innerHTML = `<span class="post-category ${getCatClass(post.category)}">${post.category}</span>`;
  document.getElementById('articleTitle').textContent = post.title;
  document.getElementById('articleByline').innerHTML = `
    <span>By <strong>${post.author}</strong></span>
    <span>${post.date}</span>
    <span>${post.readTime}</span>`;
  document.getElementById('articleBody').innerHTML = post.body;
  const overlay = document.getElementById('articleOverlay');
  overlay.classList.add('open');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeArticle(e) {
  if (e.target === document.getElementById('articleOverlay')) closeArticleBtn();
}

function closeArticleBtn() {
  const overlay = document.getElementById('articleOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── newsletter ──
async function handleNewsletter(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('.newsletter-btn');
  const btnLabel = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;
  try {
    const res = await fetch('https://formspree.io/f/xbdbydpw', {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      showToast('🌲 You\'re on the trail list! First email coming soon.');
      form.reset();
    } else {
      showToast('⚠️ Something went wrong. Please try again.');
    }
  } catch {
    showToast('⚠️ Could not connect. Please check your internet and try again.');
  } finally {
    btn.textContent = btnLabel;
    btn.disabled = false;
  }
}

// ── CMS fetch ──
async function loadCMSPosts() {
  if (cmsLoaded) return;
  try {
    const res = await fetch('/.netlify/functions/get-posts');
    if (!res.ok) throw new Error('Function returned ' + res.status);
    const cmsPosts = await res.json();
    if (Array.isArray(cmsPosts) && cmsPosts.length > 0) {
      ALL_POSTS = [...cmsPosts, ...POSTS];
      if (cmsPosts.some(p => p.featured)) {
        ALL_POSTS = ALL_POSTS.map(p => p.source === 'cms' ? p : { ...p, featured: false });
      }
    }
  } catch (e) {
    console.info('CMS posts not loaded, using sample posts:', e.message);
  }
  cmsLoaded = true;
}
