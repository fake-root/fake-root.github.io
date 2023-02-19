import CERTS from "./certs.json";
import USAGES from "./usages.json";

function App() {
  return (
    <div className="container mx-auto my-2">
      <div className="p-3 text-xl font-medium">
        <a
          className="text-sky-500 hover:underline decoration-sky-500 decoration-2"
          href="https://palant.info/2023/02/06/weakening-tls-protection-south-korean-style/"
          target="_blank"
          rel="noopener noreferrer"
        >
          각종 프로그램이 설치
        </a>
        하는 루트 인증 기관(Root CA) 목록입니다.{" "}
        <a
          className="font-bold text-sky-500 hover:underline decoration-sky-500 decoration-2"
          href="https://github.com/fake-root/fake-root.github.io/issues/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          제보하기
        </a>
      </div>
      <div className="overflow-x-scroll">
        <table className="table-auto border w-max">
          <thead>
            <tr>
              <th className="border p-2">이름</th>
              <th className="border p-2">프로그램 명</th>
              <th className="border p-2">일련번호</th>
              <th className="border p-2">SHA-1 지문</th>
              <th className="border p-2">SHA-256 지문</th>
              <th className="border p-2">유효 기간(시작)</th>
              <th className="border p-2">유효 기간(끝)</th>
              <th className="border p-2">공개 키</th>
              <th className="border p-2">서명 알고리즘</th>
              <th className="border p-2"></th>
            </tr>
          </thead>
          <tbody>
            {CERTS.map((c) => (
              <tr key={c.fingerprint}>
                <td className="border p-2 font-semibold">{c.name}</td>
                <td className="border p-2">
                  {c.fingerprint in USAGES && (
                    <a
                      className="text-sky-500 hover:underline decoration-sky-500 decoration-2"
                      // @ts-expect-error
                      href={USAGES[c.fingerprint].url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {
                        // @ts-expect-error
                        USAGES[c.fingerprint].name
                      }
                    </a>
                  )}
                </td>
                <td className="border p-2">{c.serialNumber}</td>
                <td className="border p-2">{c.fingerprint}</td>
                <td className="border p-2">{c.fingerprint256}</td>
                <td className="border p-2">
                  {new Date(c.validFrom).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(c.validTo).toLocaleDateString()}
                </td>
                <td className="border p-2 text-center">{c.publicKey}</td>
                <td className="border p-2 text-center">{c.signature}</td>
                <td className="border p-2 text-center">
                  <a
                    className="text-sky-500 hover:underline decoration-sky-500 decoration-2"
                    href={`/certs/${c.fingerprint}.cer`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    cer
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-2">
        <h1 className="p-1 font-bold">인증서 제거 방법</h1>
        <ul className="list-disc list-inside">
          <li className="my-1">
            실행 (
            <kbd className="bg-slate-200 p-0.5 border border-slate-400 rounded">
              Win
            </kbd>
            +
            <kbd className="bg-slate-200 p-0.5 border border-slate-400 rounded">
              R
            </kbd>
            ) → <code className="bg-slate-100 p-0.5">certlm.msc</code> →{" "}
            <code className="bg-slate-100 p-0.5">
              신뢰할 수 있는 루트 인증 기관
            </code>{" "}
            → <code className="bg-slate-100 p-0.5">인증서</code> → 삭제를 원하는
            인증서 오른쪽 클릭 →{" "}
            <code className="bg-slate-100 p-0.5">삭제</code>
          </li>
          <li className="my-1">
            <code className="bg-slate-100 p-0.5">
              certutil -delstore root [삭제를 원하는 인증서의 SHA-1 지문]
            </code>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
