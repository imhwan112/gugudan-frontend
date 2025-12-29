export default function PrivacyContent() {
  return (
    <div className="text-sm leading-7 text-gray-700 space-y-5">
      <section>
        <h3 className="text-base font-semibold text-gray-900">개인정보처리방침</h3>
        <p className="mt-2">
          서비스는 원활한 제공 및 품질 향상을 위해 최소한의 개인정보를 수집·이용합니다.
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900">1. 수집 항목</h4>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>이메일, 닉네임</li>
          <li>성별/MBTI 등 사용자가 입력한 선택 정보</li>
          <li>서비스 이용 기록</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900">2. 이용 목적</h4>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>사용자 식별 및 계정 관리</li>
          <li>맞춤형 상담 품질 개선</li>
          <li>서비스 운영 및 보안</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900">3. 보관 기간</h4>
        <p className="mt-2">
          원칙적으로 회원 탈퇴 시까지 보관하며, 관련 법령에 따라 보관이 필요한 경우
          해당 기간 동안 보관합니다.
        </p>
      </section>
    </div>
  );
}
