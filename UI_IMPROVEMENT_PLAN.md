# BPSC Website UI Improvement Plan

## Current Issues Identified:

### 1. Grid Layout Problems
- Using `margin-left: 250px` hack to offset fixed sidebar
- Sidebar is `position: fixed` which conflicts with grid
- Header incorrectly has `margin-left: 250px`

### 2. Header Issues
- Conflicting styles between common.css and home.css
- Title, language, Ashoka emblem, social icons need better alignment
- Needs unified government-style look

### 3. Sidebar Issues  
- Fixed positioning breaks the grid
- Logo and sidebar visually separated (different backgrounds)
- Login button needs better styling
- No proper mobile handling

### 4. Responsive Issues
- Sidebar doesn't hide/collapse properly on mobile
- Grid doesn't convert to single column
- Horizontal scroll issues

## Improvement Plan:

### Phase 1: Fix Grid Layout Structure
- [ ] Remove incorrect margin-left hacks
- [ ] Make sidebar part of grid layout properly
- [ ] Fix header to work correctly with grid
- [ ] Remove position: fixed from sidebar

### Phase 2: Improve Header Styling
- [ ] Better center title alignment and typography
- [ ] Language switch and Ashoka emblem on same line
- [ ] Social icons properly aligned to right
- [ ] Improve notice bar visibility

### Phase 3: Improve Sidebar Styling  
- [ ] Connect logo with sidebar (same background gradient)
- [ ] Better login button styling (keep in sidebar)
- [ ] Improve menu hover effects
- [ ] Add visual hierarchy

### Phase 4: Improve Visual Design
- [ ] Better color balance and typography
- [ ] Improved spacing and alignment
- [ ] Better section styling
- [ ] Government-style professional look

### Phase 5: Fix Responsive Design
- [ ] Properly hide sidebar on tablet/mobile
- [ ] Convert grid to single column on mobile
- [ ] Add hamburger menu for mobile
- [ ] Fix horizontal scroll issues

## Files to Modify:
1. `frontend/css/home.css` - Main layout and styling improvements
2. `frontend/css/common.css` - Header and shared component improvements
3. `frontend/public/index.html` - Minimal HTML adjustments if needed

## Constraints:
- DO NOT change any JavaScript logic
- DO NOT change any backend/API code
- DO NOT remove any functionality
- DO NOT rename existing classes or IDs unless absolutely necessary
- Keep all existing HTML structure intact as much as possible
- Keep login button inside the sidebar
