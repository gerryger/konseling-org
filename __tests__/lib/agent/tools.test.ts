import { assessRiskTool } from '../../../lib/agent/tools/assess-risk';
import { getPsychologistsTool } from '../../../lib/agent/tools/get-psychologists';

describe('agent tools', () => {
  it('returns a crisis risk event from assess_risk', async () => {
    const result = await assessRiskTool.execute(
      { risk_score: 78 },
      { latestUserMessage: 'Aku sangat putus asa dan ingin mengakhiri semuanya' },
    );

    expect(result.event).toEqual({
      type: 'risk',
      risk: {
        score: 78,
        level: 'high',
        shouldEscalate: true,
      },
    });
    expect(JSON.parse(result.resultContent)).toMatchObject({
      risk_score: 78,
      risk_level: 'high',
      should_escalate: true,
    });
  });

  it('filters psychologists by specialty and limits the response', async () => {
    const result = await getPsychologistsTool.execute(
      { specialty: 'trauma', limit: 1 },
      { latestUserMessage: 'Butuh bantuan sekarang' },
    );

    expect(result.event?.type).toBe('psychologists');
    if (result.event?.type === 'psychologists') {
      expect(result.event.psychologists).toHaveLength(1);
      expect(result.event.psychologists[0].tags).toContain('Trauma & Krisis');
    }

    expect(JSON.parse(result.resultContent)).toMatchObject({
      psychologists: [
        {
          name: 'Adi Kusumawardhana, M.Psi',
        },
      ],
    });
  });
});
