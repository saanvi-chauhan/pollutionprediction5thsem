const Card = ({ children, className = '', darkMode = false, hover = false, glow = false }) => {
    return (
        <div className={`
      rounded-xl p-6 transition-all duration-300
      ${darkMode
                ? 'bg-slate-800/50 border border-slate-700'
                : 'bg-white border border-gray-200 shadow-sm'
            }
      ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
      ${glow ? 'hover:shadow-primary-500/20 hover:border-primary-500/50' : ''}
      ${className}
    `}>
            {children}
        </div>
    )
}

export default Card
