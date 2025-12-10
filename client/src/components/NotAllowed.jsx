const NotAllowed = ({ message = 'You do not have access to this area.' }) => (
  <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white">
    <div>
      <div className="text-lg font-semibold">Access restricted</div>
      <p className="mt-2 text-sm text-slate-300">{message}</p>
    </div>
  </div>
)

export default NotAllowed

