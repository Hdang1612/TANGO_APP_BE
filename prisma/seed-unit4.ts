import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vocabs = [
  { japanese: "せわ　世話", vietnamese: "thế thoại . Sự chăm sóc" },
  { japanese: "かてい　家庭", vietnamese: "Gia Đình." },
  { japanese: "きょうりょく　協力", vietnamese: "Hợp tác, hiệp lực." },
  { japanese: "かんしゃ　感謝", vietnamese: "Cảm tạ." },
  { japanese: "おれい　お礼", vietnamese: "lễ." },
  { japanese: "おわび　お詫び", vietnamese: "Sá. Lời xin lỗi" },
  { japanese: "おじぎ", vietnamese: "Sự cúi chào" },
  { japanese: "あくしゅ　握手　Nと握手する", vietnamese: "Ác Thủ. Bắt tay" },
  { japanese: "いじわる(な)　意地悪", vietnamese: "Ý Địa Ác. Xấu tính , làm giận" },
  { japanese: "いたずら", vietnamese: "Nghịch ngợm , giễu cợt" },
  { japanese: "せつやく　節約", vietnamese: "Tiết ước. Sự tiết kiệm" },
  { japanese: "けいえい　経営", vietnamese: "Kinh Doanh. Quản lý , kinh doanh" },
  { japanese: "はんせい　反省", vietnamese: "Phản Tỉnh. Kiểm điểm , xem xét" },
  { japanese: "しんぽ　進歩", vietnamese: "Tiến Bộ. Sự tiến bộ , tiến triển" },
  { japanese: "じっこう　実行", vietnamese: "Thực Hành. Sự thực hiện" },
  { japanese: "へんか　変化　(変化がある/ない)", vietnamese: "Biến hoá. Sự Thay đổi , biến đổi" },
  { japanese: "かわる　変わる", vietnamese: "Thay đổi , biến đổi" },
  { japanese: "はったつ　発達", vietnamese: "Phát Đạt. Sự phát đạt . Phát triển" },
  { japanese: "たいりょく　体力", vietnamese: "Thể Lực. Thể lực" },
  { japanese: "しゅつじょう　出場　(出場者:người tham gia )", vietnamese: "Xuất Trường. Sự tham gia" },
  { japanese: "かつやく　活躍", vietnamese: "Hoạt dược. Hoạt động , thi đấu , trình diễn , sự thành công" },
  { japanese: "きょうそう　競争　(競争率. Tỉ lệ cạnh tranh )", vietnamese: "Cạnh Tranh. Sự cạnh tranh , thi đấu" },
  { japanese: "おうえん　応援", vietnamese: "Ứng viện. Hỗ trợ , cổ vũ" },
  { japanese: "はくしゅ　拍手", vietnamese: "Phách thủ. Việc vỗ tay" },
  { japanese: "にんき　人気　(人気者 ninkimono người nổi tiếng )", vietnamese: "Nhân Khí. Phổ biến , được yêu thích" },
  { japanese: "うわさ　噂", vietnamese: "Đồn. Tin đồn" },
  { japanese: "じょうほう　情報　(情報技術 じょうほうぎじゅつ)", vietnamese: "Tình Báo. Tin tức , thông tin" },
  { japanese: "こうかん　交換　= やりとり/とりかえる", vietnamese: "Giao hoán. Trao đổi , thay thế" },
  { japanese: "りゅうこう　流行", vietnamese: "Lưu Hành. Đúng mốt , hợp thời trang , trào lưu" },
  { japanese: "せんでん　宣伝　(宣伝をながす)", vietnamese: "Tuyên Truyền. Tuyên truyền , công khai" },
  { japanese: "こうこく　広告", vietnamese: "Quảng Cáo. Quảng cáo" },
  { japanese: "ちゅうもく　注目", vietnamese: "Trú Mục. Sự chú ý , sự để ý" },
  { japanese: "つうやく　通訳", vietnamese: "Thông dịch. Phiên dịch , người phiên dịch --- Cái này là dịch lời nói trực tiếp" },
  { japanese: "ほんやく　翻訳", vietnamese: "Phiên dịch. Biên dịch -- Cái này là dịch tài liêu , văn bản bài viết" },
  { japanese: "でんごん　伝言", vietnamese: "Truyền Ngôn. Lời nhắn -- dengonsuru: nhắn lại , để lại lời nhắn" },
  { japanese: "ほうこく　報告", vietnamese: "Báo cáo. Báo cáo" },
  { japanese: "ろくが　録画　ろくおんー録音：ghi âm", vietnamese: "Lục Họa. Ghi hình" },
  { japanese: "こんざつ　混雑", vietnamese: "Hỗn tạp. Đông đúc , hỗn loạn" },
  { japanese: "じゅうたい　渋滞", vietnamese: "Sáp trệ. Tắc nghẽn , tắc đường" },
  { japanese: "ひがい　被害", vietnamese: "Bị hại. Thiệt hại" },
  { japanese: "じこ　事故", vietnamese: "Sự Cố. Tai nạn , sự cố" },
  { japanese: "じけん　事件", vietnamese: "Sự Kiện. Biến cố , sự kiện" },
  { japanese: "こしょう　故障", vietnamese: "Cố Chướng. Sự cố , phá vỡ , hỏng" },
  { japanese: "しゅうり　修理　＝＝＝　なおす　直す", vietnamese: "Tu Lý. Sửa chữa" },
  { japanese: "ていでん　停電", vietnamese: "Đình điện. Mất điện" },
  { japanese: "ちょうし　調子", vietnamese: "Điều tử. Tình trạng , âm điệu ( tình trạng cơ thể , máy móc )" },
  { japanese: "きんちょう　緊張", vietnamese: "Khẩn Trương. Căng thẳng , lo lắng" },
  { japanese: "じしん　自信", vietnamese: "Tự Tín. Tự tin" },
  { japanese: "じまん　自慢", vietnamese: "TỰ MẠN. Tự mãn , khoe khoang" },
  { japanese: "かんしん　感心", vietnamese: "CẢM TÂM. Ngưỡng mộ , đáng được khen ngợi" },
  { japanese: "かんどう　感動", vietnamese: "CẢM ĐỘNG. Bị xúc động , cảm động" },
  { japanese: "こうふん　興奮", vietnamese: "HƯNG PHẤN. Hưng Phấn" },
  { japanese: "かんぞう", vietnamese: "Cảm giác , ấn tượng" },
  { japanese: "よそう　予想", vietnamese: "DỰ TƯỞNG. Dự đoán" },
  { japanese: "せんもん　専門", vietnamese: "CHUYỂN MÔN. Chuyên môn" },
  { japanese: "けんきゅう　研究", vietnamese: "NGHIÊN CỨU. Nghiên cứu , học tập , tìm hiểu" },
  { japanese: "ちょうさ　調査", vietnamese: "ĐIỀU TRA. Điều tra , khảo sát" },
  { japanese: "げんいん　原因", vietnamese: "NGUYÊN NHÂN. Nguyên nhân" },
  { japanese: "けっか　結果", vietnamese: "KẾT QUẢ. Kết quả" },
  { japanese: "かいけつ　解決", vietnamese: "GIẢI QUYẾT. Giải quyết" }
];

async function main() {
  console.log('Seeding database with Unit 4 vocabulary...');
  
  // Create Unit 4 lesson if it doesn't exist
  const lesson = await prisma.lesson.create({
    data: {
      title: 'Unit 4',
      description: 'Vocabulary list for Unit 4',
      vocabularies: {
        create: vocabs,
      }
    }
  });

  console.log(`Successfully added lesson "${lesson.title}" with ${vocabs.length} words.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
