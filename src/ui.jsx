import {useInView} from './hooks.js';
export const Icon=({k,cls='',style})=><svg className={`i ${cls}`.trim()} style={style}><use href={`#i-${k}`}/></svg>;
export function Curve(){const[ref,on]=useInView();return<svg ref={ref} className={`curve dr${on?' in':''}`} viewBox="0 0 1440 50" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path pathLength="1" d="M0 34C260 8 520 14 760 30S1200 44 1440 14"/></svg>}
export function Swash({d}){const[ref,on]=useInView();return<svg ref={ref} className={`swash dr rv${on?' in':''}`} style={{'--d':d+'s'}} viewBox="0 0 250 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path pathLength="1" d="M2 9C60 2 150 2 248 7"/></svg>}
