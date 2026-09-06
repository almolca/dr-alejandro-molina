/**
 * Feature flags.
 *
 * Spec: DR_ALEJANDRO_MOLINA_UAE_WEBSITE_MASTER_SPEC.md §12
 */

export const features = {
  /**
   * FEATURE_PRP_PAGE — spec §12 compliance gate.
   *
   * Do NOT enable, route, add to the sitemap, add to navigation, or add
   * SEO metadata/promotional copy for a PRP page until explicit
   * compliance approval has been obtained from the relevant NMC/DoH
   * process. Flip to `true` only after that approval, and only once the
   * route itself has been implemented under explicit review.
   */
  prpPage: false,
} as const;
