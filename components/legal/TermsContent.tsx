export default function TermsContent() {
  return (
    <div className="text-sm leading-7 text-gray-700 space-y-5">
      <section>
        <h3 className="text-base font-semibold text-gray-900">이용약관</h3>
        <p className="mt-2">
          본 약관은 Love-Note(이하 “서비스”)의 이용과 관련하여 서비스와 이용자 간의
          권리·의무 및 책임사항을 규정합니다.
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900">1. 서비스 제공</h4>
        <p className="mt-2">
          서비스는 AI 기반 상담 기능 및 관련 부가 기능을 제공합니다. 서비스는 운영
          정책에 따라 일부 기능을 변경할 수 있습니다.
        </p>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900">2. 이용자의 의무</h4>
        <ul className="mt-2 list-disc pl-5 space-y-1">
          <li>타인의 권리를 침해하거나 법령을 위반하는 행위를 하지 않습니다.</li>
          <li>서비스 운영을 방해하는 행위를 하지 않습니다.</li>
        </ul>
      </section>

      <section>
        <h4 className="font-semibold text-gray-900">3. 면책</h4>
        <p className="mt-2">
          서비스가 제공하는 상담 내용은 참고용이며, 전문가 상담을 대체하지 않습니다.
        </p>
      </section>

      <p className="text-xs text-gray-500">
        ※ 가입 시 동의용 약관/체크박스 UI는 별도 화면/컴포넌트로 운영될 수 있습니다.
      </p>
    </div>
  );
}
