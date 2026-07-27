type Props = {
  signal: any;
  pattern: string;
};

export default function AIDecisionPanel({
  signal,
  pattern,
}: Props) {

  return (

    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">

      <h3 className="text-xl font-bold mb-6">
        🤖 AI Decision
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        <div>
          <p className="text-gray-400">Action</p>
          <p className="font-bold text-xl">
            {signal.action}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Trend</p>
          <p>{signal.trend}</p>
        </div>

        <div>
          <p className="text-gray-400">Pattern</p>
          <p>{pattern}</p>
        </div>

        <div>
          <p className="text-gray-400">
            Confidence
          </p>
          <p>{signal.confidence}%</p>
        </div>

        <div>
          <p className="text-gray-400">
            Market
          </p>
          <p>{signal.marketCondition}</p>
        </div>

        <div>
          <p className="text-gray-400">
            Risk
          </p>
          <p>{signal.riskLevel}</p>
        </div>

      </div>

      <div className="mt-6">

        <p className="text-blue-400 font-semibold">
          💡 AI Advice
        </p>

        <p className="mt-2">
          {signal.advice}
        </p>

      </div>

    </div>

  );

}