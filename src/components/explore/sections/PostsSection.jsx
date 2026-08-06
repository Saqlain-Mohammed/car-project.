import { useState } from 'react'
import { Heart, MessageCircle, Bookmark, BadgeCheck, ImageOff, ChevronUp, ChevronDown } from 'lucide-react'
import { C, D, R, SHADOW, SERIES } from '../../../lib/theme'
import { PageHeader, ChipRow, Card, Badge, Avatar, EmptyState, Divider, Button, Input,
         useSticky, FollowButton, SaveButton, LikeButton } from '../../ui/Primitives'
import Modal, { ModalHeader } from '../../ui/Modal'
import { CardSkeleton } from '../../ui/Skeleton'

/* Filters map onto post.content_type / post_type in the schema. */
const FILTERS = ['All', 'Companies', 'Builds', 'Spotting', 'Wallpapers', 'Skills']

const POSTS = [
  { id:'c1', company:true, user:'Honda India', filter:'Companies', tag:'New Launch',
    title:'Civic Type R Limited Edition — India Exclusive',
    body:'150 units of the FL5 Type R are coming to India. Bookings open June 15th through all authorised dealers.',
    likes:4210, comments:312, img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    tags:['#TypeR','#FL5','#LimitedEdition'] },
  { id:'c2', company:true, user:'KTM India', filter:'Companies', tag:'Announcement',
    title:'390 Adventure V2 — Official Launch',
    body:'New traction control, larger tank, revised suspension. At all KTM dealers from July 1st.',
    likes:2847, comments:198, img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    tags:['#KTM390','#Adventure'] },
  { id:'u1', company:false, user:'TurboMike', filter:'Builds', tag:'Build Update',
    title:'K-Swap complete — 320hp on a stock bottom end',
    body:'Daily driven, full paperwork clear. Happy to share the whole parts list if anyone is planning the same swap.',
    likes:284, comments:42, img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
    tags:['#KSwap','#Honda','#EK9'] },
  { id:'u2', company:false, user:'DriftQueen', filter:'Spotting', tag:'Car Spotting',
    title:'Cleanest S13 I have seen at the Bangalore meet',
    body:'Three years of work. Looks completely stock but it is a pure track weapon underneath.',
    likes:512, comments:89, img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800&q=80',
    tags:['#S13','#Nissan','#JDM'] },
  { id:'u3', company:false, user:'GhostLap', filter:'Wallpapers', tag:'Wallpaper',
    title:'Supra A80 — night shoot, 6K download',
    body:'Shot on a wet street at 2am. Free to download, credit appreciated if you repost.',
    likes:3102, comments:64, img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
    tags:['#Supra','#Wallpaper','#6K'] },
  { id:'u4', company:false, user:'ApexHunter', filter:'Skills', tag:'Skill Showcase',
    title:'Heel-toe downshift breakdown',
    body:'Slowed to quarter speed so you can see the foot placement. Works on any manual car.',
    likes:2900, comments:134, img:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80',
    tags:['#Skills','#Manual','#Downshift'] },
]

const THREAD = [
  { id:1, user:'GhostLap',   text:'This is insane work — what does it cost to maintain?', votes:47, time:'1h ago',
    replies:[{ id:11, user:'TurboMike', text:'Insurance is the big one, roughly ₹45K/yr for performance cover.', votes:23, time:'55m ago' }] },
  { id:2, user:'DriftQueen', text:'Which shop did the tune? Been looking for someone who knows K-series.', votes:31, time:'1h ago', replies:[] },
  { id:3, user:'IronBlock',  text:'Daily driven on this? Absolute madman.', votes:89, time:'2h ago', replies:[] },
]

const fmt = n => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)

/* ── Card ───────────────────────────────────────────────── */
function PostCard({ post, onOpen, accent }) {
  const [broken, setBroken] = useState(false)

  return (
    <article onClick={onOpen} className="t-lift t-zoom"
      style={{ background:C.surface, borderRadius:R.lg, overflow:'hidden', boxShadow:SHADOW.sm, cursor:'pointer', display:'flex', flexDirection:'column' }}>

      <div style={{ position:'relative', height:172, background:C.surface2, overflow:'hidden' }}>
        {broken ? (
          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ImageOff size={22} color={C.textDim} />
          </div>
        ) : (
          <img src={post.img} alt="" onError={() => setBroken(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(20,24,31,0.85) 0%, transparent 55%)' }} />
        <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:'0.4rem' }}>
          {post.company && <Badge tone="success">✓ Verified</Badge>}
        </div>
        <div style={{ position:'absolute', top:12, right:12 }}>
          <Badge tone={post.company ? 'accent' : 'neutral'}>{post.tag}</Badge>
        </div>
      </div>

      {/* body — 12px inner radius inside a 16px card at 12px padding */}
      <div style={{ padding:'0.95rem 1.05rem 1.05rem', display:'flex', flexDirection:'column', gap:'0.6rem', flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.55rem' }}>
          <Avatar name={post.user} size={26} tone={accent} />
          <span style={{ fontFamily:D.body, fontSize:'0.815rem', fontWeight:600, color:C.text }}>{post.user}</span>
          {post.company && <BadgeCheck size={13} color={C.success} />}
        </div>

        <h3 style={{ fontFamily:D.display, fontSize:'0.975rem', fontWeight:600, color:C.text, lineHeight:1.35, letterSpacing:'-0.01em' }}>
          {post.title}
        </h3>
        <p style={{ fontFamily:D.body, fontSize:'0.825rem', color:C.textMuted, lineHeight:1.55, flex:1 }}>{post.body}</p>

        <Divider style={{ marginTop:'0.2rem' }} />

        <div style={{ display:'flex', alignItems:'center', gap:'0.25rem' }}>
          <LikeButton postId={post.id} count={post.likes} />
          <button onClick={e => { e.stopPropagation(); onOpen() }} className="t-press"
            style={{
              display:'flex', alignItems:'center', gap:'0.4rem', height:32, padding:'0 0.6rem',
              borderRadius:R.sm, background:'none', border:'none', cursor:'pointer',
              fontFamily:D.body, fontSize:'0.79rem', fontWeight:600, color:C.textMuted, fontVariantNumeric:'tabular-nums',
            }}>
            <MessageCircle size={14} /> {post.comments}
          </button>
          <span style={{ marginLeft:'auto' }}><SaveButton postId={post.id} /></span>
        </div>
      </div>
    </article>
  )
}

/* ── Detail modal ───────────────────────────────────────── */
function PostDetail({ post: postProp, onClose }) {
  const post = useSticky(postProp)
  const [draft, setDraft]     = useState('')
  const [thread, setThread]   = useState(THREAD)
  const [expanded, setExpanded] = useState({})

  if (!post) return null

  const submit = () => {
    if (!draft.trim()) return
    setThread(t => [{ id: Date.now(), user:'You', text: draft, votes: 1, time:'now', replies: [] }, ...t])
    setDraft('')
  }

  return (
    <Modal open={!!postProp} onClose={onClose} width={680} labelledBy="post-title">
      <div style={{ overflowY:'auto' }}>
        <div style={{ height:260, position:'relative', background:C.surface2 }}>
          <img src={post.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, ${C.surface} 0%, transparent 60%)` }} />
        </div>

        <div style={{ padding:'0 1.75rem 1.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'1rem' }}>
            <Avatar name={post.user} size={38} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <span style={{ fontFamily:D.body, fontSize:'0.925rem', fontWeight:600, color:C.text }}>{post.user}</span>
                {post.company && <BadgeCheck size={14} color={C.success} />}
              </div>
              <span style={{ fontFamily:D.body, fontSize:'0.73rem', color:C.textMuted }}>{post.tag}</span>
            </div>
            <FollowButton profileId={post.user} />
          </div>

          <h2 id="post-title" style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, lineHeight:1.25, letterSpacing:'-0.015em', marginBottom:'0.6rem' }}>
            {post.title}
          </h2>
          <p style={{ fontFamily:D.body, fontSize:'0.925rem', color:C.textSoft, lineHeight:1.7, marginBottom:'1rem' }}>{post.body}</p>

          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
            {post.tags.map(t => <Badge key={t} tone="accent">{t}</Badge>)}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', paddingBottom:'1.25rem' }}>
            <LikeButton postId={post.id} count={post.likes} />
            <span style={{ display:'flex', alignItems:'center', gap:'0.4rem', height:32, padding:'0 0.6rem',
                           fontFamily:D.body, fontSize:'0.79rem', fontWeight:600, color:C.textMuted }}>
              <MessageCircle size={14} /> {post.comments}
            </span>
            <SaveButton postId={post.id} />
          </div>

          <Divider />

          <div style={{ paddingTop:'1.25rem' }}>
            <div style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.textDim, marginBottom:'0.9rem' }}>
              Discussion · {post.comments}
            </div>

            <div style={{ display:'flex', gap:'0.55rem', marginBottom:'1.25rem' }}>
              <Input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add to the discussion…"
                onKeyDown={e => e.key === 'Enter' && submit()} />
              <Button onClick={submit} disabled={!draft.trim()}>Post</Button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
              {thread.map(c => (
                <div key={c.id} style={{ display:'flex', gap:'0.6rem' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.1rem', flexShrink:0, paddingTop:2 }}>
                    <ChevronUp size={14} color={C.textDim} style={{ cursor:'pointer' }} />
                    <span style={{ fontFamily:D.display, fontSize:'0.72rem', fontWeight:700, color:C.live, fontVariantNumeric:'tabular-nums' }}>{c.votes}</span>
                    <ChevronDown size={14} color={C.textDim} style={{ cursor:'pointer' }} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ background:C.surface2, borderRadius:R.md, padding:'0.7rem 0.9rem' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', marginBottom:'0.35rem' }}>
                        <Avatar name={c.user} size={20} />
                        <span style={{ fontFamily:D.body, fontSize:'0.775rem', fontWeight:600, color:C.text }}>{c.user}</span>
                        <span style={{ fontFamily:D.body, fontSize:'0.68rem', color:C.textDim }}>{c.time}</span>
                      </div>
                      <p style={{ fontFamily:D.body, fontSize:'0.86rem', color:C.textSoft, lineHeight:1.55 }}>{c.text}</p>
                    </div>
                    {c.replies.length > 0 && (
                      <>
                        <button onClick={() => setExpanded(e => ({ ...e, [c.id]: !e[c.id] }))}
                          style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, color:C.textMuted, background:'none', border:'none', cursor:'pointer', padding:'0.4rem 0.2rem' }}>
                          {expanded[c.id] ? 'Hide replies' : `${c.replies.length} repl${c.replies.length === 1 ? 'y' : 'ies'}`}
                        </button>
                        {expanded[c.id] && (
                          <div style={{ marginLeft:'1rem', paddingLeft:'0.85rem', boxShadow:`inset 2px 0 0 ${C.border}`, display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                            {c.replies.map(r => (
                              <div key={r.id} style={{ background:C.surface2, borderRadius:R.sm, padding:'0.6rem 0.8rem' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.25rem' }}>
                                  <Avatar name={r.user} size={18} />
                                  <span style={{ fontFamily:D.body, fontSize:'0.74rem', fontWeight:600, color:C.text }}>{r.user}</span>
                                  <span style={{ fontFamily:D.body, fontSize:'0.66rem', color:C.textDim }}>{r.time}</span>
                                </div>
                                <p style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textSoft, lineHeight:1.5 }}>{r.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function PostsSection() {
  const [filter, setFilter] = useState('All')
  const [detail, setDetail] = useState(null)
  const loading = false

  const visible = filter === 'All' ? POSTS : POSTS.filter(p => p.filter === filter)
  const companies = visible.filter(p => p.company)
  const community = visible.filter(p => !p.company)

  const grid = { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.15rem' }
  const sectionLabel = (text, tone) => (
    <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.9rem' }}>
      <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:tone }}>{text}</span>
      <div style={{ flex:1, height:1, background:C.border }} />
    </div>
  )

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1400 }}>
      <PageHeader eyebrow="Explore" title="Feed"
        description="Verified brand announcements alongside real builds from the community." />

      <div style={{ marginBottom:'1.75rem' }}>
        <ChipRow options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {loading ? (
        <div style={grid}>{Array.from({ length:6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : visible.length === 0 ? (
        <EmptyState icon={ImageOff} title="Nothing here yet"
          message="No posts match this filter. Try another category."
          action={<Button variant="neutral" onClick={() => setFilter('All')}>Show all posts</Button>} />
      ) : (
        <>
          {companies.length > 0 && (
            <section style={{ marginBottom: community.length ? '2.5rem' : 0 }}>
              {sectionLabel('Verified companies', C.success)}
              <div style={grid}>
                {companies.map((p, i) => <PostCard key={p.id} post={p} accent={SERIES[i % SERIES.length]} onOpen={() => setDetail(p)} />)}
              </div>
            </section>
          )}
          {community.length > 0 && (
            <section>
              {companies.length > 0 && sectionLabel('From the community', C.textDim)}
              <div style={grid}>
                {community.map((p, i) => <PostCard key={p.id} post={p} accent={SERIES[(i + 2) % SERIES.length]} onOpen={() => setDetail(p)} />)}
              </div>
            </section>
          )}
        </>
      )}

      <PostDetail post={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
