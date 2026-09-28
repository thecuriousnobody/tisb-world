import { Box } from '@mui/material'
import type { Venture } from '../data/ventures'
import { C, F, accent } from './tokens'

/**
 * A venture's figure: its art (or its brush kanji on white when there's none),
 * the venture's accent as a hairline along the bottom, and a small vermilion
 * seal marking it as a TISB company.
 *
 * `overlay` stamps the kanji top-left over the art too (Home cards do; the
 * dense Ventures table doesn't) — ink on light art, paper on dark art.
 */
export default function VentureTile({
  v, ratio = '16/9', kanjiSize = 84, overlay = false, seal = 6,
}: { v: Venture; ratio?: string; kanjiSize?: number; overlay?: boolean; seal?: number }) {
  return (
    <Box
      sx={{
        position: 'relative', aspectRatio: ratio, overflow: 'hidden',
        background: C.paperPure, border: `1px solid ${C.hairline}`, display: 'grid', placeItems: 'center',
      }}
    >
      {v.art ? (
        <img
          src={v.art}
          alt={`${v.name}`}
          loading="lazy"
          decoding="async"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            // podcastbots' zoom crops its blurred side strips; it composes with
            // the .s-zoom hover scale because that lives on the wrapper's img
            // selector, so apply zoom via `scale` rather than `transform`.
            scale: v.artZoom ? String(v.artZoom) : undefined,
          }}
        />
      ) : (
        <Box component="span" aria-hidden="true" sx={{ font: `${kanjiSize}px/1 ${F.brush}` }}>{v.kanji}</Box>
      )}

      {v.art && overlay && (
        <Box
          component="span"
          aria-hidden="true"
          sx={{
            position: 'absolute', left: 14, top: 10, font: `34px/1 ${F.brush}`,
            color: v.artIsDark ? C.paper : C.ink,
          }}
        >
          {v.kanji}
        </Box>
      )}

      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '2px', background: accent(v.accentHue) }} />
      <Box
        sx={{
          position: 'absolute', right: seal + 3, top: seal + 3,
          width: seal, height: seal, background: C.vermilion,
        }}
      />
    </Box>
  )
}
