const year = new Date().getFullYear();
export const FOOTER_TEMPLATES = {
  copyright: `
    <p class="text-sm text-gray-400 text-center">
      © ${year} All rights reserved.
    </p>
  `,
  list: `
    <ul class="flex justify-center gap-6 text-sm">
      <li><a href="/about">About</a></li>
      <li><a href="/privacy">Privacy</a></li>
      <li><a href="/terms">Terms</a></li>
    </ul>
  `,
  links: `
    <ul class="flex justify-center gap-6 text-sm">
      <li><a href="">Facebook</a></li>
      <li><a href="">Instagram</a></li>
      <li><a href="">Twitter</a></li>
    </ul>
  `,
};
