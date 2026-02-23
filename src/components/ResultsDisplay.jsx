import { Shield, ShieldAlert, ShieldX, AlertTriangle, CheckCircle, XCircle, RefreshCw, Share2, Flag } from 'lucide-react'

const riskConfig = {
  safe: {
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    badgeColor: 'bg-green-500',
    icon: Shield,
    label: 'Safe',
    description: 'No scam indicators detected'
  },
  suspicious: {
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    badgeColor: 'bg-yellow-500',
    icon: AlertTriangle,
    label: 'Suspicious',
    description: 'Some concerning elements found'
  },
  likely_scam: {
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    badgeColor: 'bg-orange-500',
    icon: ShieldAlert,
    label: 'Likely Scam',
    description: 'Multiple scam indicators detected'
  },
  confirmed_scam: {
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    badgeColor: 'bg-red-500',
    icon: ShieldX,
    label: 'Scam Detected',
    description: 'Matches known scam patterns'
  }
}

function ResultsDisplay({ result, onReset }) {
  const config = riskConfig[result.risk_level] || riskConfig.suspicious
  const Icon = config.icon

  const formatScamType = (type) => {
    if (!type) return null
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Risk Level Header */}
      <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6`}>
        <div className="flex items-center gap-4">
          <div className={`${config.badgeColor} p-3 rounded-xl`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className={`text-2xl font-bold ${config.textColor}`}>
                {config.label}
              </h3>
              <span className={`px-3 py-1 ${config.badgeColor} text-white text-sm font-medium rounded-full`}>
                {result.confidence}% confidence
              </span>
            </div>
            <p className={`${config.textColor} opacity-80 mt-1`}>
              {config.description}
            </p>
          </div>
        </div>

        {result.scam_type && (
          <div className={`mt-4 pt-4 border-t ${config.borderColor}`}>
            <span className={`text-sm ${config.textColor} opacity-70`}>Scam Type: </span>
            <span className={`font-medium ${config.textColor}`}>
              {formatScamType(result.scam_type)}
            </span>
          </div>
        )}
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-700">{result.explanation}</p>
        </div>
      )}

      {/* Red Flags */}
      {result.red_flags && result.red_flags.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-500" />
            Red Flags Detected ({result.red_flags.length})
          </h4>
          <div className="space-y-3">
            {result.red_flags.map((flag, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-100 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">{flag.description}</p>
                    {flag.evidence && (
                      <p className="mt-1 text-sm text-red-600 bg-red-100 px-2 py-1 rounded font-mono">
                        "{flag.evidence}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Recommended Actions
          </h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl p-3"
              >
                <span className="w-6 h-6 bg-green-500 text-white text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-green-800">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onReset}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Check Another
        </button>
        <button
          onClick={() => {
            const text = `Scam Check Result: ${config.label} (${result.confidence}% confidence)\n\n${result.explanation || ''}`
            navigator.clipboard.writeText(text)
          }}
          className="btn-secondary flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Copy Result
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center">
        This analysis is for guidance only. Always verify through official channels before taking action.
      </p>
    </div>
  )
}

export default ResultsDisplay
