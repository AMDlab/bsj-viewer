import Viewer from '@/components/viewer';

export default function Home() {
  return (
    <>
      <button className="absolute bottom-0 left-0 ml-6 mb-4 z-[100] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        <a href="/example.ifc" target="_blank">
          サンプルIFCファイルダウンロード
        </a>
      </button>
      <Viewer />
    </>
  );
}
