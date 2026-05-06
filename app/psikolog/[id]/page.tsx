interface Props {
  params: Promise<{ id: string }>
}

export default async function PsikologProfilePage({ params }: Props) {
  const { id } = await params

  return (
    <div className="pt-24 pb-20 container min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-headline-lg text-on-surface">Profil Psikolog</h1>
        <p className="text-body-md text-on-surface-variant">ID: {id}</p>
        <p className="text-body-md text-on-surface-variant">Segera hadir.</p>
      </div>
    </div>
  )
}
