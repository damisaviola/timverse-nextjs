import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { verifyJwt } from '@/lib/jwt'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Keamanan & Manajemen Sesi Global (Middleware)
 * Optimasi untuk mencegah Infinite Redirect Loop.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // 1. Inisialisasi Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. Identifikasi Rute
  const isAdminArea = pathname.startsWith('/admin') && pathname !== ROUTES.ADMIN.LOGIN
  const isAdminLoginPage = pathname === ROUTES.ADMIN.LOGIN
  const isUserProfilePage = pathname.startsWith(ROUTES.PROFILE)
  const isUserAuthPage = pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER

  // 3. Validasi Sesi (Minimalis)
  // Ambil user dan token secara paralel
  const [userResult, adminTokenObj] = await Promise.all([
    supabase.auth.getUser().catch(() => ({ data: { user: null } })),
    request.cookies.get('admin_token')
  ])

  const user = userResult.data.user
  const adminToken = adminTokenObj?.value

  let isAdminValid = false
  if (adminToken) {
    try {
      const payload = await verifyJwt(adminToken)
      isAdminValid = !!(payload && payload.role === 'admin')
    } catch {
      isAdminValid = false
      response.cookies.delete('admin_token')
    }
  }

  // 4. LOGIKA PENGALIHAN (REDIRECT)

  // Kasus A: Akses Admin Area tanpa token yang sah
  if (isAdminArea && !isAdminValid) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.LOGIN, request.url))
  }

  // Kasus B: Akses Admin Login padahal sudah login admin
  if (isAdminLoginPage && isAdminValid) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN.DASHBOARD, request.url))
  }

  // Kasus C: Proteksi Profil User
  if (isUserProfilePage) {
    if (!user) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
    }
    // Admin dilarang masuk profil user biasa jika mereka tidak punya profil
    // (Bisa dikembangkan lebih lanjut di sini jika perlu)
  }

  // Kasus D: Pengguna login dilarang balik ke halaman Login/Register user
  if (isUserAuthPage && user && !isAdminValid) {
    return NextResponse.redirect(new URL(ROUTES.PROFILE, request.url))
  }

  return response
}
