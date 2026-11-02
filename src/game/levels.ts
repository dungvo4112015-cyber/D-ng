/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoxCollider, LevelDefinition } from './types';
import { ALL_50_TRAPS } from './traps';

export interface LevelMeta {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  chapter: number;
  chapterName: string;
  skyTheme: 'dawn' | 'zenith' | 'sunset' | 'cyber' | 'emerald' | 'crimson' | 'midnight' | 'neon';
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export const LEVEL_METAS: LevelMeta[] = [
  // CHƯƠNG 1: TẬP SỰ PARKOUR (MÀN 1 - 10)
  {
    id: 1,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Sân Khởi Đầu',
    subtitle: 'Nhập môn nhảy đà & trượt dốc',
    description: 'Làm quen với gia tốc chạy, căn chỉnh bước nhảy qua các bục bê tông và cú trượt thấp.',
    skyTheme: 'dawn',
    difficulty: 1,
  },
  {
    id: 2,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Hành Lang Gió',
    subtitle: 'Nghệ thuật chạy trên tường',
    description: 'Chạy dọc các bức tường thẳng đứng, búng nhảy qua hẻm núi không gian và tăng tốc tối đa.',
    skyTheme: 'zenith',
    difficulty: 1,
  },
  {
    id: 3,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Tháp Đỉnh Cao',
    subtitle: 'Chinh phục độ cao nghẹt thở',
    description: 'Thử thách leo tháp đa tầng với các bục di động, bệ nhún liên hoàn và hẻm vực hẹp.',
    skyTheme: 'sunset',
    difficulty: 2,
  },
  {
    id: 4,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Cầu Kính Không Gian',
    subtitle: 'Căn nhịp nhảy kép & lướt gió',
    description: 'Chuỗi cầu bê tông thuôn hẹp và khoảng không vực thẳm đòi hỏi thuần thục cú nhảy đúp (Double Jump).',
    skyTheme: 'cyber',
    difficulty: 2,
  },
  {
    id: 5,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Hẻm Núi Siêu Tốc',
    subtitle: 'Tốc độ tối đa trên dải băng chuyền',
    description: 'Kết hợp liên hoàn dải tăng tốc (Speed Strip), trượt dốc dưới cổng chắn laser và chạy tường cong.',
    skyTheme: 'zenith',
    difficulty: 2,
  },
  {
    id: 6,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Bậc Thềm Pha Lê',
    subtitle: 'Chuỗi nhảy nhịp nhàng qua vực thẳm',
    description: 'Các bục nổi với khoảng cách tăng dần yêu cầu căn chuẩn nhịp chạy đà và cú nhảy kép.',
    skyTheme: 'midnight',
    difficulty: 2,
  },
  {
    id: 7,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Đường Hầm Ánh Sáng',
    subtitle: 'Lướt thấp liên tục né chướng ngại',
    description: 'Hàng loạt thanh cản thấp liên tiếp đòi hỏi phản xạ trượt người (Slide [C]) ở vận tốc cao.',
    skyTheme: 'neon',
    difficulty: 2,
  },
  {
    id: 8,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Vách Đá Đối Xứng',
    subtitle: 'Kỹ năng búng tường đổi hướng ziczac',
    description: 'Hai vách tường dựng đứng song song tạo đường chạy ziczac liên hoàn qua hẻm núi.',
    skyTheme: 'dawn',
    difficulty: 2,
  },
  {
    id: 9,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Thang Máy Đa Trục',
    subtitle: 'Phối hợp bệ di động và bệ phóng',
    description: 'Bệ chuyển động ngang và đứng yêu cầu người chơi tính toán thời điểm tiếp đất chuẩn xác.',
    skyTheme: 'sunset',
    difficulty: 3,
  },
  {
    id: 10,
    chapter: 1,
    chapterName: 'Tập Sự Parkour',
    name: 'Tốt Nghiệp Tập Sự',
    subtitle: 'Bài kiểm tra tổng hợp chương 1',
    description: 'Tổng hợp mọi kỹ năng nhảy kép, trượt thấp, bám tường và bệ nhún ở độ khó nâng cao.',
    skyTheme: 'zenith',
    difficulty: 3,
  },

  // CHƯƠNG 2: TĂNG TỐC & PHẢN XẠ (MÀN 11 - 20)
  {
    id: 11,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Dải Băng Xanh',
    subtitle: 'Tăng tốc tối đa trên đường dốc hẹp',
    description: 'Ba dải tăng tốc liên tục đẩy vận tốc lên trên 60 km/h, đòi hỏi né chướng ngại chớp nhoáng.',
    skyTheme: 'neon',
    difficulty: 2,
  },
  {
    id: 12,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Hẻm Vực Gió Hú',
    subtitle: 'Nhảy kép vượt qua vực sâu không đáy',
    description: 'Khoảng cách giữa các bục cực rộng, chỉ có thể vượt qua bằng cú nhảy đúp kết hợp lướt gió (Air Dash).',
    skyTheme: 'zenith',
    difficulty: 3,
  },
  {
    id: 13,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Cung Điện Gương',
    subtitle: 'Chạy tường kép liên hoàn 3 nhịp',
    description: 'Ba bức tường phản quang liên tiếp đòi hỏi búng nhảy đúng góc để giữ nguyên đà tốc độ.',
    skyTheme: 'midnight',
    difficulty: 3,
  },
  {
    id: 14,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Bệ Phóng Phản Lực',
    subtitle: 'Bệ nhún siêu cao và căn điểm rơi',
    description: 'Bệ nhún cực đại phóng bạn bay bổng lên độ cao 30m, cần căn chỉnh góc nhìn để tiếp đất chính xác.',
    skyTheme: 'sunset',
    difficulty: 3,
  },
  {
    id: 15,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Cổng Chắn Trượt Đôi',
    subtitle: 'Phối hợp trượt thấp và lướt không trung',
    description: 'Vừa trượt dốc thoát khỏi thanh chắn vừa phải nhảy kép vượt qua khoảng trống ngay phía trước.',
    skyTheme: 'crimson',
    difficulty: 3,
  },
  {
    id: 16,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Tháp Đung Đưa',
    subtitle: 'Bục di chuyển ngang nhịp độ nhanh',
    description: 'Hai bục di động dao động với chu kỳ lệch pha nhau thử thách khả năng căn nhịp của bạn.',
    skyTheme: 'dawn',
    difficulty: 3,
  },
  {
    id: 17,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Con Đường Hoàng Hôn',
    subtitle: 'Chuỗi trụ đá so le đòi hỏi chính xác',
    description: 'Trụ đá diện tích nhỏ hẹp trải dài dưới ánh hoàng hôn rực rỡ.',
    skyTheme: 'sunset',
    difficulty: 3,
  },
  {
    id: 18,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Vòng Xoáy Tốc Độ',
    subtitle: 'Dải tăng tốc kết hợp nhảy rào cản',
    description: 'Đạt vận tốc cực đại và thực hiện cú nhảy kép vượt qua hai rào chắn năng lượng liên hồi.',
    skyTheme: 'neon',
    difficulty: 3,
  },
  {
    id: 19,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Hẻm Núi Đỏ',
    subtitle: 'Leo vách đá dốc với bệ nhún liên tiếp',
    description: 'Chuỗi 2 bệ nhún liên hoàn phóng thẳng người chơi lên đỉnh đèo đá sa thạch đỏ.',
    skyTheme: 'crimson',
    difficulty: 4,
  },
  {
    id: 20,
    chapter: 2,
    chapterName: 'Tăng Tốc & Phản Xạ',
    name: 'Đỉnh Cao Tốc Độ',
    subtitle: 'Bài kiểm tra phản xạ nhịp tim cao',
    description: 'Đường đua không có điểm nghỉ, duy trì tốc độ trên 55 km/h từ điểm xuất phát đến đích.',
    skyTheme: 'cyber',
    difficulty: 4,
  },

  // CHƯƠNG 3: KHÔNG GIAN & VỰC THẲM (MÀN 21 - 30)
  {
    id: 21,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Vực Thẳm Cyber',
    subtitle: 'Bầu trời tím huyền bí và cầu thuôn mỏng',
    description: 'Đường chạy là những dải băng hẹp không có lan can bảo vệ giữa không gian vũ trụ tĩnh mịch.',
    skyTheme: 'cyber',
    difficulty: 3,
  },
  {
    id: 22,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Mạng Lưới Neon',
    subtitle: 'Bám tường phát sáng và nhảy kép góc hẹp',
    description: 'Các mảng tường neon xanh ngọc và cam đối xứng yêu cầu kỹ năng đổi hướng sắc bén.',
    skyTheme: 'neon',
    difficulty: 3,
  },
  {
    id: 23,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Vườn Treo Tinh Vân',
    subtitle: 'Các bục đá lơ lửng không trung',
    description: 'Mỗi bước chân là một phép thử về sự chính xác trên các phiến đá trôi dạt giữa tinh vân.',
    skyTheme: 'midnight',
    difficulty: 3,
  },
  {
    id: 24,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Nhịp Cầu Trọng Lực',
    subtitle: 'Bệ di chuyển lên xuống thẳng đứng',
    description: 'Thang máy trọng lực đưa người chơi lên cao để bắt kịp điểm bám của bức tường kế tiếp.',
    skyTheme: 'zenith',
    difficulty: 4,
  },
  {
    id: 25,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Đường Hầm Cảm Ứng',
    subtitle: 'Trượt thấp dưới hàng rào bảo vệ',
    description: 'Khu vực thử thách kỹ năng trượt dốc (Slide) dài nhất với 3 cổng cản liên tiếp.',
    skyTheme: 'emerald',
    difficulty: 4,
  },
  {
    id: 26,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Vách Tường ZicZac',
    subtitle: 'Chuyển đổi hướng tường liên tục 4 lần',
    description: 'Chạy tường 4 nhịp luân phiên trái - phải - trái - phải để vượt qua hẻm núi sâu 80m.',
    skyTheme: 'cyber',
    difficulty: 4,
  },
  {
    id: 27,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Điểm Nhảy Vô Cực',
    subtitle: 'Căn thời điểm nhảy kép ở mép bục',
    description: 'Khai thác tối đa cơ chế Coyote Time và Nhảy Kép để vượt qua khoảng trống 18 mét.',
    skyTheme: 'midnight',
    difficulty: 4,
  },
  {
    id: 28,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Cung Đường Sao Băng',
    subtitle: 'Băng chuyền gia tốc cực đại',
    description: 'Dải tăng tốc siêu mạnh kết hợp bệ nhún đưa bạn bay vút qua bầu trời sao băng rực sáng.',
    skyTheme: 'neon',
    difficulty: 4,
  },
  {
    id: 29,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Tháp Không Gian',
    subtitle: 'Leo tháp đa hướng giữa trời đêm',
    description: 'Tháp hình xoắn ốc với các bục di động và tường bám đưa người chơi lên tầng bình lưu.',
    skyTheme: 'midnight',
    difficulty: 4,
  },
  {
    id: 30,
    chapter: 3,
    chapterName: 'Không Gian & Vực Thẳm',
    name: 'Cổng Không Gian',
    subtitle: 'Thử thách đại chiến không trung',
    description: 'Bài thi tốt nghiệp chương 3 với toàn bộ thử thách không trọng lực.',
    skyTheme: 'cyber',
    difficulty: 4,
  },

  // CHƯƠNG 4: NHÀ MÁY TRỌNG LỰC (MÀN 31 - 40)
  {
    id: 31,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Lò Luyện Kim Loại',
    subtitle: 'Bầu trời rực lửa và thép tối giản',
    description: 'Không gian công nghiệp sắc cam cháy rực rỡ với các dầm thép kết cấu vững chãi.',
    skyTheme: 'sunset',
    difficulty: 4,
  },
  {
    id: 32,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Bệ Di Động Kép',
    subtitle: 'Hai bục di chuyển ngược chiều',
    description: 'Bước nhảy chuyển giao giữa hai bục đang di chuyển ngược chiều đòi hỏi sự tập trung cao độ.',
    skyTheme: 'crimson',
    difficulty: 4,
  },
  {
    id: 33,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Cầu Bê Tông Nổi',
    subtitle: 'Nhảy liên tiếp trên mặt phẳng hẹp',
    description: 'Các tấm sàn bê tông nổi trên không gian mở với các góc cua gấp 90 độ.',
    skyTheme: 'dawn',
    difficulty: 4,
  },
  {
    id: 34,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Vách Trượt Siêu Dài',
    subtitle: 'Chạy tường dài kết hợp búng nhảy',
    description: 'Bức tường dài 35 mét chạy dọc theo hành lang gió, kết thúc bằng một cú bật nhảy tiếp đất.',
    skyTheme: 'sunset',
    difficulty: 4,
  },
  {
    id: 35,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Lò Xo Đẩy Lên',
    subtitle: 'Bệ phóng liên hoàn 3 tầng cao',
    description: 'Chuỗi 3 bệ nhún nối tiếp nhau đưa người chơi đạt độ cao kỷ lục 45 mét.',
    skyTheme: 'crimson',
    difficulty: 4,
  },
  {
    id: 36,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Cổng Chắn Laser',
    subtitle: 'Chuỗi thanh cản trượt dốc liên hồi',
    description: 'Trượt người liên tục qua các thanh chắn thấp ở vận tốc bứt tốc (Sprint).',
    skyTheme: 'emerald',
    difficulty: 4,
  },
  {
    id: 37,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Trục Nâng Công Nghiệp',
    subtitle: 'Thang máy thẳng đứng tốc độ cao',
    description: 'Đón đúng nhịp thang máy để phóng lên tầng áp chóp của khu phức hợp.',
    skyTheme: 'sunset',
    difficulty: 4,
  },
  {
    id: 38,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Mê Cung Monolith',
    subtitle: 'Vượt qua khối kiến trúc khổng lồ',
    description: 'Các cột đá nguyên khối cao chọc trời dựng đứng tạo nên hẻm vực hiểm trở.',
    skyTheme: 'midnight',
    difficulty: 5,
  },
  {
    id: 39,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Băng Chuyền Đảo Chiều',
    subtitle: 'Đòi hỏi căn bước chạy chính xác',
    description: 'Dải tăng tốc hướng thẳng vào bục di động đang rung lắc mạnh mẽ.',
    skyTheme: 'crimson',
    difficulty: 5,
  },
  {
    id: 40,
    chapter: 4,
    chapterName: 'Nhà Máy Trọng Lực',
    name: 'Trái Tim Nhà Máy',
    subtitle: 'Chinh phục đỉnh cao lò luyện',
    description: 'Màn chơi thách thức toàn bộ phản xạ trọng lực và kỹ năng giữ thăng bằng.',
    skyTheme: 'sunset',
    difficulty: 5,
  },

  // CHƯƠNG 5: ĐỈNH CAO ĐẠI SƯ (MÀN 41 - 50)
  {
    id: 41,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Khởi Đầu Huyền Thoại',
    subtitle: 'Bước chân vào đấu trường tối thượng',
    description: 'Khởi đầu chương cuối cùng với chuỗi chướng ngại vật đòi hỏi kỹ năng parkour điêu luyện.',
    skyTheme: 'emerald',
    difficulty: 5,
  },
  {
    id: 42,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Bão Gió Tầng Cao',
    subtitle: 'Chạy tường trên mây ở độ cao 50m',
    description: 'Gió rít mạnh mẽ trên các mảng tường treo lơ lửng giữa tầng mây bồng bềnh.',
    skyTheme: 'dawn',
    difficulty: 5,
  },
  {
    id: 43,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Ma Trận Bục Nhảy',
    subtitle: 'Kết hợp nhảy kép và bệ nhún đa tầng',
    description: 'Ma trận gồm 6 bục nổi thuôn nhỏ đòi hỏi độ chính xác tuyệt đối trong từng cú nhấp phím.',
    skyTheme: 'zenith',
    difficulty: 5,
  },
  {
    id: 44,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Thung Lũng Ngọc Lục Bảo',
    subtitle: 'Kiến trúc ngọc bích và bục di động',
    description: 'Bầu trời xanh ngọc bảo rực rỡ và những vách tường phát quang kiêu hãnh.',
    skyTheme: 'emerald',
    difficulty: 5,
  },
  {
    id: 45,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Hẻm Núi Tử Thần',
    subtitle: 'Khoảng cách nhảy tối đa giữa các đỉnh',
    description: 'Chỉ có thể vượt qua bằng cú nhảy đà bứt tốc kết hợp cú nhảy kép và cú lướt chuẩn từng mili giây.',
    skyTheme: 'midnight',
    difficulty: 5,
  },
  {
    id: 46,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Cung Điện Bình Minh',
    subtitle: 'Bầu trời vàng rực và đường chạy hẹp',
    description: 'Con đường ánh sáng dát vàng chạy thẳng tới ngọn tháp đền thờ uy nghiêm.',
    skyTheme: 'dawn',
    difficulty: 5,
  },
  {
    id: 47,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Chuỗi Phản Xạ Đỉnh Cao',
    subtitle: 'Phối hợp mọi kỹ năng parkour',
    description: 'Chạy tường -> Búng nhảy -> Trượt rào -> Bệ nhún -> Nhảy kép -> Tiếp đất an toàn.',
    skyTheme: 'cyber',
    difficulty: 5,
  },
  {
    id: 48,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Cột Trụ Vô Cực',
    subtitle: 'Leo trụ xoắn ốc hướng thẳng lên trời',
    description: 'Độ cao tăng liên tục từ 0m lên 60m thông qua chuỗi bệ nhún và tường nghiêng.',
    skyTheme: 'neon',
    difficulty: 5,
  },
  {
    id: 49,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Cổng Cực Hạn',
    subtitle: 'Chặng thử thách áp chót nghẹt thở',
    description: 'Bàn đạp cuối cùng trước khi chạm tay vào danh hiệu Đại Sư Parkour Huyền Thoại.',
    skyTheme: 'crimson',
    difficulty: 5,
  },
  {
    id: 50,
    chapter: 5,
    chapterName: 'Đỉnh Cao Đại Sư',
    name: 'Đại Sư Huyền Thoại',
    subtitle: 'Chinh phục ngôi vương tối thượng',
    description: 'Kiệt tác parkour 3D đỉnh cao gồm 12 phân đoạn ngoạn mục vinh danh người chạy vĩ đại nhất.',
    skyTheme: 'dawn',
    difficulty: 5,
  },
];

// ============================================================================
// LEVEL ARCHETYPES & THEMES (ENSURING EVERY LEVEL IS UNIQUELY DIFFERENT)
// ============================================================================

export interface LevelPalette {
  plazaColor: string;
  groundColor: string;
  wallRunColor: string;
  accentColor: string;
  monolithColor: string;
  finishColor: string;
}

export function getLevelPalette(id: number, chapter: number, skyTheme: string): LevelPalette {
  // Bespoke distinct palettes per level & chapter
  if (chapter === 1) {
    const accents = ['#06b6d4', '#f97316', '#ef4444', '#0284c7', '#d97706', '#059669', '#c026d3', '#ea580c', '#3b82f6', '#eab308'];
    const accent = accents[(id - 1) % accents.length];
    return {
      plazaColor: '#f8fafc',
      groundColor: id % 2 === 0 ? '#f1f5f9' : '#ffffff',
      wallRunColor: accent,
      accentColor: accent,
      monolithColor: id === 10 ? '#eab308' : '#94a3b8',
      finishColor: '#ffffff',
    };
  }

  if (chapter === 2) {
    const neonWalls = ['#38bdf8', '#34d399', '#f43f5e', '#f59e0b', '#a855f7', '#14b8a6', '#fbbf24', '#06b6d4', '#f87171', '#6366f1'];
    const wall = neonWalls[(id - 11) % neonWalls.length];
    return {
      plazaColor: '#0f172a',
      groundColor: '#1e293b',
      wallRunColor: wall,
      accentColor: wall,
      monolithColor: '#334155',
      finishColor: '#0f172a',
    };
  }

  if (chapter === 3) {
    const cosmicAccents = ['#8b5cf6', '#06b6d4', '#22c55e', '#f97316', '#d946ef', '#38bdf8', '#e11d48', '#10b981', '#60a5fa', '#a855f7'];
    const acc = cosmicAccents[(id - 21) % cosmicAccents.length];
    return {
      plazaColor: '#020617',
      groundColor: '#0f172a',
      wallRunColor: acc,
      accentColor: acc,
      monolithColor: '#1e1b4b',
      finishColor: '#020617',
    };
  }

  if (chapter === 4) {
    const forgeAccents = ['#ea580c', '#dc2626', '#eab308', '#f97316', '#ec4899', '#34d399', '#f59e0b', '#94a3b8', '#fb923c', '#ef4444'];
    const acc = forgeAccents[(id - 31) % forgeAccents.length];
    return {
      plazaColor: '#1c1917',
      groundColor: '#292524',
      wallRunColor: acc,
      accentColor: acc,
      monolithColor: '#44403c',
      finishColor: '#1c1917',
    };
  }

  // Chapter 5: Apex Grand Master
  const apexAccents = ['#10b981', '#38bdf8', '#818cf8', '#34d399', '#ef4444', '#eab308', '#06b6d4', '#a855f7', '#f43f5e', '#f59e0b'];
  const acc = apexAccents[(id - 41) % apexAccents.length];
  return {
    plazaColor: id === 50 ? '#0f172a' : '#042f2e',
    groundColor: id === 50 ? '#ffffff' : '#f8fafc',
    wallRunColor: acc,
    accentColor: acc,
    monolithColor: id === 50 ? '#eab308' : '#064e3b',
    finishColor: '#ffffff',
  };
}

export type SegmentType =
  | 'runway_slide'
  | 'chasm_stepping'
  | 'wall_run_left'
  | 'wall_run_right'
  | 'wall_dual_zigzag'
  | 'bounce_launcher'
  | 'elevator_up'
  | 'sway_horizontal'
  | 'slide_tunnel_triple'
  | 'narrow_beam'
  | 'saw_corridor'
  | 'crusher_gauntlet'
  | 'laser_sweeper_arena'
  | 'steep_ascent'
  | 'steep_descent'
  | 'tower_spiral_ascent'
  | 'canyon_cliff_dive'
  | 'checkpoint_arch'
  | 'apex_sprint';

/**
 * Curated unique course structure for every level (1 to 50).
 * Every level features prominent climbs ('chỗ lên'), steep plunges ('chỗ xuống'),
 * multiple checkpoints, and an extended course length (300m - 500m).
 */
export function getLevelCourseBlueprint(id: number): SegmentType[] {
  // Diverse curated pools for dynamic variety across all 50 levels
  const ascents: SegmentType[] = ['steep_ascent', 'tower_spiral_ascent', 'bounce_launcher', 'elevator_up'];
  const descents: SegmentType[] = ['steep_descent', 'canyon_cliff_dive', 'slide_tunnel_triple'];
  const techSegments: SegmentType[] = [
    'wall_run_left',
    'wall_run_right',
    'chasm_stepping',
    'narrow_beam',
    'wall_dual_zigzag',
    'sway_horizontal',
  ];
  const gauntlets: SegmentType[] = ['crusher_gauntlet', 'laser_sweeper_arena', 'saw_corridor'];

  const asc1 = ascents[(id - 1) % ascents.length];
  const desc1 = descents[(id - 1) % descents.length];
  const tech1 = techSegments[(id - 1) % techSegments.length];
  const gnt1 = gauntlets[(id - 1) % gauntlets.length];

  const asc2 = ascents[(id + 2) % ascents.length];
  const desc2 = descents[(id + 1) % descents.length];
  const tech2 = techSegments[(id + 3) % techSegments.length];
  const gnt2 = gauntlets[(id + 2) % gauntlets.length];

  if (id === 50) {
    // Ultimate Grand Finale Level 50: 16 Segments with All Climbs and Drops!
    return [
      'runway_slide',
      'steep_ascent',
      'wall_run_left',
      'checkpoint_arch',
      'crusher_gauntlet',
      'canyon_cliff_dive',
      'narrow_beam',
      'checkpoint_arch',
      'laser_sweeper_arena',
      'tower_spiral_ascent',
      'saw_corridor',
      'checkpoint_arch',
      'steep_descent',
      'wall_dual_zigzag',
      'elevator_up',
      'apex_sprint',
    ];
  }

  // Extended 14-segment course: Guaranteed climbs, drops, checkpoints, and long tracks!
  return [
    'runway_slide',
    asc1,              // 1. Chỗ lên (Ascent 1: +12m to +16m)
    tech1,
    'checkpoint_arch', // Cổng kiểm soát 1
    gnt1,
    desc1,             // 2. Chỗ xuống (Descent 1: -14m to -18m)
    'runway_slide',
    'checkpoint_arch', // Cổng kiểm soát 2
    tech2,
    asc2,              // 3. Chỗ lên thứ 2 (Ascent 2: +12m)
    gnt2,
    'checkpoint_arch', // Cổng kiểm soát 3
    desc2,             // 4. Chỗ xuống thứ 2 (Descent 2: -14m)
    'apex_sprint',
  ];
}

/**
 * Builds a deterministic, fully playable LevelDefinition for any level from 1 to 50.
 * Every single level has an entirely distinct layout, elevation, palette, and obstacle set.
 */
export function buildLevel(meta: LevelMeta): LevelDefinition {
  const colliders: BoxCollider[] = [];
  const id = meta.id;
  const palette = getLevelPalette(id, meta.chapter, meta.skyTheme);

  // 1. Unique Starting Plaza per level
  const plazaWidth = id % 3 === 0 ? 12 : id % 2 === 0 ? 9 : 10;
  const plazaLen = id === 50 ? 24 : 18;
  colliders.push({
    id: `l${id}_start_plaza`,
    type: 'ground',
    x: 0,
    y: 0,
    z: -plazaLen / 3,
    width: plazaWidth,
    height: 2,
    depth: plazaLen,
    color: palette.plazaColor,
  });

  // Architectural starting wings / pillars
  colliders.push(
    {
      id: `l${id}_wing_l`,
      type: 'wall',
      x: -plazaWidth / 2 - 0.5,
      y: 2,
      z: -plazaLen / 3,
      width: 0.8,
      height: 4.5,
      depth: plazaLen,
      color: palette.monolithColor,
    },
    {
      id: `l${id}_wing_r`,
      type: 'wall',
      x: plazaWidth / 2 + 0.5,
      y: 2,
      z: -plazaLen / 3,
      width: 0.8,
      height: 4.5,
      depth: plazaLen,
      color: palette.monolithColor,
    }
  );

  let currentZ = -plazaLen;
  let currentY = 0;
  let cpIndex = 1;

  const blueprint = getLevelCourseBlueprint(id);

  blueprint.forEach((segType, stageIdx) => {
    const stageId = `l${id}_s${stageIdx}`;

    if (segType === 'runway_slide') {
      const len = 12 + (id % 4);
      colliders.push({
        id: `${stageId}_runway`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - len / 2,
        width: 6.5,
        height: 2,
        depth: len,
        color: palette.groundColor,
      });

      // Speed booster strip
      colliders.push({
        id: `${stageId}_speed`,
        type: 'speed',
        x: 0,
        y: currentY + 1.05,
        z: currentZ - 4,
        width: 3.4,
        height: 0.1,
        depth: 6,
        color: palette.accentColor,
        metadata: { speedBoost: 16 + (id % 8) },
      });

      // Alternate trap type on runway: Laser hurdle OR Flamethrower nozzle
      if (stageIdx % 2 === 0) {
        colliders.push({
          id: `${stageId}_laser`,
          type: 'hazard',
          x: 0,
          y: currentY + 2.15,
          z: currentZ - 8.5,
          width: 6.8,
          height: 0.3,
          depth: 0.35,
          metadata: {
            hazardType: 'laser',
            hazardName: 'Rào Cản Laser',
            hazardTip: 'Trượt dốc [C] hoặc Air Dash [E] để luồn dưới tia laser!',
          },
        });
      } else {
        colliders.push({
          id: `${stageId}_flame`,
          type: 'hazard',
          x: 0,
          y: currentY + 2.2,
          z: currentZ - 8.5,
          width: 3.0,
          height: 2.2,
          depth: 1.5,
          metadata: {
            hazardType: 'flamethrower',
            hazardName: 'Họng Phun Lửa',
            hazardTip: 'Nhảy kép [Space x2] bổng qua luồng lửa hỏa ngục!',
          },
        });
      }

      currentZ -= len + 3;
    } else if (segType === 'chasm_stepping') {
      const gap = 8 + (id % 5);
      currentZ -= gap;
      currentY += stageIdx % 2 === 0 ? 1.4 : -0.8;

      const pW = 4.2 - (meta.difficulty > 3 ? 0.8 : 0);
      const side = stageIdx % 2 === 0 ? 2.6 : -2.6;

      // First stepping pillar
      colliders.push({
        id: `${stageId}_pil1`,
        type: 'ground',
        x: side,
        y: currentY,
        z: currentZ - 4,
        width: pW,
        height: 6,
        depth: 5.5,
        color: palette.groundColor,
      });

      // Abyss lethal spike bed
      colliders.push({
        id: `${stageId}_spikes`,
        type: 'hazard',
        x: 0,
        y: currentY - 2.8,
        z: currentZ - 4,
        width: 9,
        height: 1.2,
        depth: 6,
        metadata: {
          hazardType: 'spikes',
          hazardName: 'Hố Chông Sắt',
          hazardTip: 'Nhảy kép [Space x2] tiếp đất chính xác giữa bục đá!',
        },
      });

      currentZ -= 10;

      // Second stepping pillar
      colliders.push({
        id: `${stageId}_pil2`,
        type: 'ground',
        x: -side * 0.85,
        y: currentY + 1.0,
        z: currentZ - 4,
        width: pW,
        height: 7,
        depth: 5.5,
        color: palette.groundColor,
      });

      // Diverse aerial hazard between pillars: Swinging Pendulum Spike Ball OR Rotating Saw
      if (stageIdx % 2 === 1) {
        colliders.push({
          id: `${stageId}_pendulum`,
          type: 'hazard',
          x: 0,
          y: currentY + 2.5,
          z: currentZ - 4,
          width: 2.2,
          height: 2.2,
          depth: 2.2,
          metadata: {
            hazardType: 'pendulum_spikeball',
            hazardName: 'Quả Cầu Gai Đung Đưa',
            hazardTip: 'Chờ quả cầu gai lắc sang bên rồi mới nhảy qua!',
            moving: { axis: 'x', distance: 5.5, speed: 2.4 },
          },
        });
      } else if (meta.difficulty >= 3) {
        colliders.push({
          id: `${stageId}_midair_saw`,
          type: 'hazard',
          x: side * 0.3,
          y: currentY + 2.2,
          z: currentZ - 9,
          width: 2.2,
          height: 2.2,
          depth: 0.3,
          metadata: {
            hazardType: 'saw',
            hazardName: 'Lưỡi Cưa Treo',
            hazardTip: 'Căn khoảng trống an toàn bên cạnh đĩa cưa để vượt qua!',
            rotating: { axis: 'y', speed: 3.8 },
          },
        });
      }

      currentZ -= 10;
    } else if (segType === 'wall_run_left' || segType === 'wall_run_right') {
      const isRight = segType === 'wall_run_right';
      const wallX = isRight ? 4.8 : -4.8;
      const wLen = 22 + (id % 6);

      colliders.push({
        id: `${stageId}_wall`,
        type: 'wall',
        x: wallX,
        y: currentY + 4,
        z: currentZ - wLen / 2,
        width: 0.6,
        height: 10,
        depth: wLen,
        color: palette.wallRunColor,
      });

      // Pit spikes under wall corridor
      colliders.push({
        id: `${stageId}_pit_spikes`,
        type: 'hazard',
        x: 0,
        y: currentY - 2.5,
        z: currentZ - wLen / 2,
        width: 9,
        height: 1.0,
        depth: wLen * 0.8,
        metadata: {
          hazardType: 'spikes',
          hazardName: 'Hố Chông Hẻm Núi',
          hazardTip: 'Giữ đà bám tường để không bị rơi xuống hố chông!',
        },
      });

      // Alternate: Laser barrier OR Wall Flamethrower jet
      if (id % 2 === 0) {
        colliders.push({
          id: `${stageId}_wall_laser`,
          type: 'hazard',
          x: isRight ? 2.4 : -2.4,
          y: currentY + 3.2,
          z: currentZ - wLen / 2,
          width: 4.5,
          height: 0.35,
          depth: 0.35,
          metadata: {
            hazardType: 'laser',
            hazardName: 'Rào Laser Cắt Ngang',
            hazardTip: 'Búng nhảy khỏi tường đúng lúc để bay qua rào chắn laser!',
          },
        });
      } else {
        colliders.push({
          id: `${stageId}_wall_flame`,
          type: 'hazard',
          x: isRight ? 2.0 : -2.0,
          y: currentY + 3.0,
          z: currentZ - wLen / 2,
          width: 3.0,
          height: 2.2,
          depth: 1.5,
          metadata: {
            hazardType: 'flamethrower',
            hazardName: 'Họng Phun Lửa Vách Núi',
            hazardTip: 'Búng tường bật ra xa để tránh luồng lửa hỏa ngục!',
          },
        });
      }

      currentZ -= wLen + 3;
      currentY += 1.5;

      // Landing platform
      colliders.push({
        id: `${stageId}_land`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 4,
        width: 7.5,
        height: 3,
        depth: 8,
        color: palette.groundColor,
      });

      currentZ -= 8;
    } else if (segType === 'wall_dual_zigzag') {
      const wLen = 16 + (id % 4);

      colliders.push(
        {
          id: `${stageId}_w_left`,
          type: 'wall',
          x: -5.0,
          y: currentY + 4,
          z: currentZ - wLen / 2,
          width: 0.6,
          height: 9,
          depth: wLen,
          color: palette.wallRunColor,
        },
        {
          id: `${stageId}_w_right`,
          type: 'wall',
          x: 5.0,
          y: currentY + 5,
          z: currentZ - wLen - wLen / 2,
          width: 0.6,
          height: 9,
          depth: wLen,
          color: palette.accentColor,
        }
      );

      // Spike bed under dual wall
      colliders.push({
        id: `${stageId}_dual_spikes`,
        type: 'hazard',
        x: 0,
        y: currentY - 2.5,
        z: currentZ - wLen,
        width: 9,
        height: 1.0,
        depth: wLen * 1.5,
        metadata: {
          hazardType: 'spikes',
          hazardName: 'Hố Chông Hẻm Vực',
          hazardTip: 'Nhảy búng chuyển tường liên tục để duy trì độ cao!',
        },
      });

      currentZ -= wLen * 2 + 4;
      currentY += 2;

      colliders.push({
        id: `${stageId}_zigzag_land`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 4,
        width: 8,
        height: 3,
        depth: 8,
        color: palette.groundColor,
      });

      currentZ -= 8;
    } else if (segType === 'crusher_gauntlet') {
      // Hydraulic Crusher Hammer Gauntlet
      const cLen = 18;
      colliders.push({
        id: `${stageId}_crush_floor`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - cLen / 2,
        width: 7,
        height: 2,
        depth: cLen,
        color: palette.groundColor,
      });

      // Dual Heavy Hydraulic Hammers slamming up and down
      colliders.push(
        {
          id: `${stageId}_hammer_1`,
          type: 'hazard',
          x: -1.6,
          y: currentY + 2.8,
          z: currentZ - 6,
          width: 3.2,
          height: 2.2,
          depth: 2.5,
          metadata: {
            hazardType: 'hammer',
            hazardName: 'Búa Nghiền Thủy Lực',
            hazardTip: 'Búa đập cực mạnh! Hãy tăng tốc chạy qua khi búa nhấc lên cao!',
            moving: { axis: 'y', distance: 3.6, speed: 3.0 },
          },
        },
        {
          id: `${stageId}_hammer_2`,
          type: 'hazard',
          x: 1.6,
          y: currentY + 2.8,
          z: currentZ - 12,
          width: 3.2,
          height: 2.2,
          depth: 2.5,
          metadata: {
            hazardType: 'hammer',
            hazardName: 'Búa Nghiền Thủy Lực',
            hazardTip: 'Căn nhịp búa đập thứ hai để lướt nhanh qua!',
            moving: { axis: 'y', distance: 3.6, speed: -3.0 },
          },
        }
      );

      currentZ -= cLen + 4;
    } else if (segType === 'laser_sweeper_arena') {
      // 360-degree Rotating Laser Sweeper Arena
      const arenaLen = 20;
      colliders.push({
        id: `${stageId}_arena_floor`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - arenaLen / 2,
        width: 10,
        height: 2,
        depth: arenaLen,
        color: palette.groundColor,
      });

      // Electric shock tiles on arena edges
      colliders.push(
        {
          id: `${stageId}_shock_l`,
          type: 'hazard',
          x: -3.8,
          y: currentY + 1.05,
          z: currentZ - arenaLen / 2,
          width: 2.2,
          height: 0.15,
          depth: arenaLen * 0.8,
          metadata: {
            hazardType: 'shock_grid',
            hazardName: 'Lưới Điện Cao Thế',
            hazardTip: 'Mặt sàn tích điện! Giữ vững tâm chạy ở dải trung tâm an toàn!',
          },
        },
        {
          id: `${stageId}_shock_r`,
          type: 'hazard',
          x: 3.8,
          y: currentY + 1.05,
          z: currentZ - arenaLen / 2,
          width: 2.2,
          height: 0.15,
          depth: arenaLen * 0.8,
          metadata: {
            hazardType: 'shock_grid',
            hazardName: 'Lưới Điện Cao Thế',
            hazardTip: 'Tránh xa dải sàn tích điện hai bên mép!',
          },
        }
      );

      // Central Rotating Laser Sweeper Tower
      colliders.push({
        id: `${stageId}_sweeper`,
        type: 'hazard',
        x: 0,
        y: currentY + 1.8,
        z: currentZ - arenaLen / 2,
        width: 9.5,
        height: 0.4,
        depth: 0.4,
        metadata: {
          hazardType: 'laser_sweeper',
          hazardName: 'Laser Quét 360°',
          hazardTip: 'Tia laser quét liên tục vòng quanh! Nhảy kép bổng qua lưỡi tia quét!',
          rotating: { axis: 'y', speed: 2.8 },
        },
      });

      currentZ -= arenaLen + 4;
    } else if (segType === 'bounce_launcher') {
      colliders.push({
        id: `${stageId}_bpad_base`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 4,
        width: 6,
        height: 2,
        depth: 7,
        color: palette.groundColor,
      });

      const bouncePower = 20 + Math.min(8, Math.floor(id / 6));
      colliders.push({
        id: `${stageId}_bpad`,
        type: 'bounce',
        x: 0,
        y: currentY + 1.15,
        z: currentZ - 4,
        width: 4,
        height: 0.3,
        depth: 4,
        color: '#ec4899',
        metadata: { bounceStrength: bouncePower },
      });

      // Floating lethal laser hurdle over launch arc
      colliders.push({
        id: `${stageId}_launch_laser`,
        type: 'hazard',
        x: 0,
        y: currentY + 5.2,
        z: currentZ - 10,
        width: 7.5,
        height: 0.35,
        depth: 0.35,
        metadata: {
          hazardType: 'laser',
          hazardName: 'Lưới Laser Không Gian',
          hazardTip: 'Căn chỉnh hướng bay của bệ nhún để vượt qua rào laser!',
        },
      });

      // High landing terrace
      currentZ -= 18;
      currentY += 10;

      colliders.push({
        id: `${stageId}_high_tier`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 5,
        width: 8,
        height: 4,
        depth: 10,
        color: palette.groundColor,
      });

      currentZ -= 10;
    } else if (segType === 'elevator_up') {
      currentZ -= 7;

      colliders.push({
        id: `${stageId}_elevator`,
        type: 'ground',
        x: 0,
        y: currentY + 2,
        z: currentZ - 4,
        width: 5.5,
        height: 2,
        depth: 5.5,
        color: palette.accentColor,
        metadata: {
          moving: {
            axis: 'y',
            distance: 10,
            speed: 2.2 + (id % 4) * 0.25,
          },
        },
      });

      // Rotating saw blade on elevator shaft
      colliders.push({
        id: `${stageId}_shaft_saw`,
        type: 'hazard',
        x: 3.2,
        y: currentY + 4.5,
        z: currentZ - 4,
        width: 2.2,
        height: 2.2,
        depth: 0.3,
        metadata: {
          hazardType: 'saw',
          hazardName: 'Lưỡi Cưa Trục Nâng',
          hazardTip: 'Đứng vững giữa bệ nâng và tránh né lưỡi cưa gắn trên trục!',
          rotating: { axis: 'x', speed: 4.2 },
        },
      });

      currentZ -= 14;
      currentY += 10;

      colliders.push({
        id: `${stageId}_elev_land`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 4,
        width: 7.5,
        height: 3,
        depth: 8,
        color: palette.groundColor,
      });

      currentZ -= 8;
    } else if (segType === 'sway_horizontal') {
      currentZ -= 8;

      colliders.push({
        id: `${stageId}_sway`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 4,
        width: 5.5,
        height: 2,
        depth: 5.5,
        color: palette.accentColor,
        metadata: {
          moving: {
            axis: 'x',
            distance: 7,
            speed: 2.0 + (id % 5) * 0.2,
          },
        },
      });

      // Pit spikes under swaying chasm
      colliders.push({
        id: `${stageId}_sway_spikes`,
        type: 'hazard',
        x: 0,
        y: currentY - 3,
        z: currentZ - 4,
        width: 10,
        height: 1.2,
        depth: 8,
        metadata: {
          hazardType: 'spikes',
          hazardName: 'Hố Chông Hẻm Vực',
          hazardTip: 'Đón đúng nhịp bệ di động để tiếp đất an toàn!',
        },
      });

      currentZ -= 14;

      colliders.push({
        id: `${stageId}_sway_land`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 4,
        width: 7.5,
        height: 3,
        depth: 8,
        color: palette.groundColor,
      });

      currentZ -= 8;
    } else if (segType === 'slide_tunnel_triple') {
      // Covered tunnel with 3 consecutive laser hurdles
      const tunnelLen = 24;
      colliders.push({
        id: `${stageId}_tunnel_floor`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - tunnelLen / 2,
        width: 6,
        height: 2,
        depth: tunnelLen,
        color: palette.groundColor,
      });

      // 3 Laser Hurdles in rhythmic sequence
      for (let h = 0; h < 3; h++) {
        colliders.push({
          id: `${stageId}_tunnel_laser_${h}`,
          type: 'hazard',
          x: 0,
          y: currentY + 2.15,
          z: currentZ - 6 - h * 7,
          width: 6.2,
          height: 0.3,
          depth: 0.35,
          metadata: {
            hazardType: 'laser',
            hazardName: 'Cổng Laser Hầm Tối',
            hazardTip: 'Giữ phím [C] để trượt dốc liên hồi qua 3 cổng chắn laser!',
          },
        });
      }

      currentZ -= tunnelLen + 4;
    } else if (segType === 'narrow_beam') {
      // Razor-thin bridge suspended over abyss with Spiked Roller
      const beamLen = 18;
      colliders.push({
        id: `${stageId}_beam`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - beamLen / 2,
        width: 2.4, // Razor thin
        height: 2,
        depth: beamLen,
        color: palette.groundColor,
      });

      // Rotating Spiked Roller rolling on beam
      colliders.push({
        id: `${stageId}_beam_roller`,
        type: 'hazard',
        x: 0,
        y: currentY + 1.8,
        z: currentZ - beamLen / 2,
        width: 2.2,
        height: 2.2,
        depth: 2.2,
        metadata: {
          hazardType: 'roller_spikes',
          hazardName: 'Trục Lăn Gai Nghiền',
          hazardTip: 'Trục gai lăn liên tục trên cầu! Nhảy kép [Space x2] vọt qua đỉnh trục!',
          rotating: { axis: 'x', speed: 5.5 },
        },
      });

      // Abyss spikes below
      colliders.push({
        id: `${stageId}_beam_spikes`,
        type: 'hazard',
        x: 0,
        y: currentY - 3,
        z: currentZ - beamLen / 2,
        width: 8,
        height: 1.0,
        depth: beamLen,
        metadata: {
          hazardType: 'spikes',
          hazardName: 'Hố Chông Đáy Vực',
          hazardTip: 'Căn chính xác bước chạy trên cầu thuôn mỏng!',
        },
      });

      currentZ -= beamLen + 4;
    } else if (segType === 'saw_corridor') {
      // Corridor flanked by dual rotating saws
      const cLen = 16;
      colliders.push({
        id: `${stageId}_saw_floor`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - cLen / 2,
        width: 4.8,
        height: 2,
        depth: cLen,
        color: palette.groundColor,
      });

      colliders.push(
        {
          id: `${stageId}_saw_l`,
          type: 'hazard',
          x: -2.0,
          y: currentY + 2.0,
          z: currentZ - 6,
          width: 2.0,
          height: 2.0,
          depth: 0.3,
          metadata: {
            hazardType: 'saw',
            hazardName: 'Lưỡi Cưa Cánh Tả',
            hazardTip: 'Lưỡi cưa quay tốc độ cao! Lướt nhanh qua khe hở giữa hai đĩa cưa!',
            rotating: { axis: 'x', speed: 5.0 },
          },
        },
        {
          id: `${stageId}_saw_r`,
          type: 'hazard',
          x: 2.0,
          y: currentY + 2.0,
          z: currentZ - 11,
          width: 2.0,
          height: 2.0,
          depth: 0.3,
          metadata: {
            hazardType: 'saw',
            hazardName: 'Lưỡi Cưa Cánh Hữu',
            hazardTip: 'Né sang mép đối diện để tránh lưỡi cưa thứ hai!',
            rotating: { axis: 'x', speed: -5.0 },
          },
        }
      );

      currentZ -= cLen + 4;
    } else if (segType === 'checkpoint_arch') {
      // Functional glowing Checkpoint Gate Arch
      const cpLen = 12;
      colliders.push({
        id: `${stageId}_cp_floor`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - cpLen / 2,
        width: 7.5,
        height: 2,
        depth: cpLen,
        color: palette.groundColor,
      });

      // Speed recharge booster
      colliders.push({
        id: `${stageId}_cp_boost`,
        type: 'speed',
        x: 0,
        y: currentY + 1.05,
        z: currentZ - cpLen / 2,
        width: 3.2,
        height: 0.1,
        depth: cpLen * 0.75,
        color: palette.accentColor,
        metadata: { speedBoost: 18 },
      });

      // Checkpoint Collider Trigger
      colliders.push({
        id: `l${id}_cp_${cpIndex}`,
        type: 'checkpoint',
        x: 0,
        y: currentY + 3.0,
        z: currentZ - cpLen / 2,
        width: 8,
        height: 5.5,
        depth: 2.5,
        metadata: { checkpointIndex: cpIndex },
      });
      cpIndex++;

      currentZ -= cpLen + 3;
    } else if (segType === 'steep_ascent') {
      // Chỗ lên: 4-Tier High Stepped Ascent Climbing Gauntlet (+14m elevation)
      const numSteps = 4;
      const stepLift = 3.5;
      const stepD = 8;
      for (let s = 0; s < numSteps; s++) {
        currentY += stepLift;
        currentZ -= stepD;
        const xOffset = s % 2 === 0 ? 1.5 : -1.5;

        colliders.push({
          id: `${stageId}_step_${s}`,
          type: 'ground',
          x: xOffset,
          y: currentY,
          z: currentZ,
          width: 6.5,
          height: 3,
          depth: stepD - 1.2,
          color: palette.groundColor,
        });

        // Add a signature lethal trap from ALL_50_TRAPS on each step
        const trapDef = ALL_50_TRAPS[(id * 3 + stageIdx * 5 + s * 7) % ALL_50_TRAPS.length];
        colliders.push({
          id: `${stageId}_step_trap_${s}`,
          type: 'hazard',
          x: xOffset,
          y: currentY + 2.0,
          z: currentZ,
          width: 3.5,
          height: 1.8,
          depth: 1.8,
          metadata: {
            hazardType: trapDef.id,
            hazardName: trapDef.name,
            hazardTip: trapDef.evasionTip,
            moving: trapDef.visualModel === 'hammer' ? { axis: 'y', distance: 3.2, speed: 2.8 } : undefined,
            rotating: ['roller_spikes', 'saw', 'laser_sweeper', 'blade_fan'].includes(trapDef.visualModel)
              ? { axis: 'y', speed: 3.5 }
              : undefined,
          },
        });
      }
      currentZ -= 4;
    } else if (segType === 'steep_descent') {
      // Chỗ xuống: High-Speed Downhill Sliding Chute (-16m elevation drop)
      const numDrops = 4;
      const dropDrop = -4.0;
      const dropD = 9;
      for (let d = 0; d < numDrops; d++) {
        currentY += dropDrop;
        currentZ -= dropD;

        colliders.push({
          id: `${stageId}_drop_${d}`,
          type: 'ground',
          x: 0,
          y: currentY,
          z: currentZ,
          width: 7.0,
          height: 2.5,
          depth: dropD,
          color: palette.groundColor,
        });

        // Speed stripe on descending slope
        colliders.push({
          id: `${stageId}_drop_speed_${d}`,
          type: 'speed',
          x: 0,
          y: currentY + 1.05,
          z: currentZ,
          width: 3.0,
          height: 0.1,
          depth: dropD * 0.8,
          color: palette.accentColor,
          metadata: { speedBoost: 20 },
        });

        // Low-clearance slide hurdle trap
        const trapDef = ALL_50_TRAPS[(id * 5 + stageIdx * 3 + d * 11) % ALL_50_TRAPS.length];
        colliders.push({
          id: `${stageId}_drop_trap_${d}`,
          type: 'hazard',
          x: 0,
          y: currentY + 1.25,
          z: currentZ,
          width: 6.8,
          height: 0.35,
          depth: 0.35,
          metadata: {
            hazardType: trapDef.id,
            hazardName: trapDef.name,
            hazardTip: 'Trượt người [C] thật thấp lao vút xuống dốc để luồn qua bẫy!',
          },
        });
      }
      currentZ -= 4;
    } else if (segType === 'tower_spiral_ascent') {
      // Chỗ lên: Ascending Spiral Tower Catwalks (+14m elevation climb)
      const spiralRadius = 5.5;
      const turns = 4;
      for (let t = 0; t < turns; t++) {
        currentY += 3.5;
        currentZ -= 7;
        const angle = (t * Math.PI) / 2;
        const sx = Math.sin(angle) * spiralRadius;

        colliders.push({
          id: `${stageId}_spiral_${t}`,
          type: 'ground',
          x: sx,
          y: currentY,
          z: currentZ,
          width: 5.5,
          height: 3,
          depth: 6.5,
          color: palette.groundColor,
        });

        // Wall run strip along exterior
        colliders.push({
          id: `${stageId}_spiral_w_${t}`,
          type: 'wall',
          x: sx + (sx >= 0 ? 3.0 : -3.0),
          y: currentY + 3.5,
          z: currentZ,
          width: 0.5,
          height: 7,
          depth: 6.5,
          color: palette.wallRunColor,
        });
      }

      // Central rotating obstacle tower
      const trapDef = ALL_50_TRAPS[(id * 9 + stageIdx) % ALL_50_TRAPS.length];
      colliders.push({
        id: `${stageId}_spiral_core_trap`,
        type: 'hazard',
        x: 0,
        y: currentY - 5,
        z: currentZ + 14,
        width: 10,
        height: 0.4,
        depth: 0.4,
        metadata: {
          hazardType: trapDef.id,
          hazardName: trapDef.name,
          hazardTip: trapDef.evasionTip,
          rotating: { axis: 'y', speed: 3.2 },
        },
      });

      currentZ -= 6;
    } else if (segType === 'canyon_cliff_dive') {
      // Chỗ xuống: 18m High-Cliff Freefall into Abyss Gorge with Bounce Pad Launch
      colliders.push({
        id: `${stageId}_cliff_edge`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 4,
        width: 7,
        height: 3,
        depth: 8,
        color: palette.groundColor,
      });

      // Aerial laser hurdle forcing dive
      colliders.push({
        id: `${stageId}_dive_hurdle`,
        type: 'hazard',
        x: 0,
        y: currentY + 2.0,
        z: currentZ - 6,
        width: 7,
        height: 0.35,
        depth: 0.35,
        metadata: {
          hazardType: 'laser',
          hazardName: 'Rào Cản Mép Vực',
          hazardTip: 'Lao thẳng người lao xuống vực sâu bên dưới!',
        },
      });

      // Plunge 18 meters down
      currentY -= 18;
      currentZ -= 16;

      // Bottom canyon floor
      colliders.push({
        id: `${stageId}_canyon_floor`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - 6,
        width: 8,
        height: 3,
        depth: 14,
        color: palette.groundColor,
      });

      // Giant catch Bounce Pad at the bottom
      colliders.push({
        id: `${stageId}_canyon_bounce`,
        type: 'bounce',
        x: 0,
        y: currentY + 1.15,
        z: currentZ - 4,
        width: 5.5,
        height: 0.3,
        depth: 5.5,
        color: '#ec4899',
        metadata: { bounceStrength: 26 },
      });

      // Perimeter lethal hazard around bounce pad
      const trapDef = ALL_50_TRAPS[(id * 13 + stageIdx) % ALL_50_TRAPS.length];
      colliders.push(
        {
          id: `${stageId}_canyon_trap_l`,
          type: 'hazard',
          x: -3.8,
          y: currentY + 1.05,
          z: currentZ - 6,
          width: 2.0,
          height: 0.2,
          depth: 12,
          metadata: {
            hazardType: trapDef.id,
            hazardName: trapDef.name,
            hazardTip: trapDef.evasionTip,
          },
        },
        {
          id: `${stageId}_canyon_trap_r`,
          type: 'hazard',
          x: 3.8,
          y: currentY + 1.05,
          z: currentZ - 6,
          width: 2.0,
          height: 0.2,
          depth: 12,
          metadata: {
            hazardType: trapDef.id,
            hazardName: trapDef.name,
            hazardTip: trapDef.evasionTip,
          },
        }
      );

      currentZ -= 14;
      // apex_sprint: Maximum velocity launch into finish gate
      const aLen = 14;
      colliders.push({
        id: `${stageId}_apex_runway`,
        type: 'ground',
        x: 0,
        y: currentY,
        z: currentZ - aLen / 2,
        width: 7,
        height: 2,
        depth: aLen,
        color: palette.groundColor,
      });

      colliders.push({
        id: `${stageId}_apex_speed`,
        type: 'speed',
        x: 0,
        y: currentY + 1.05,
        z: currentZ - 4,
        width: 3.5,
        height: 0.1,
        depth: 6,
        color: palette.accentColor,
        metadata: { speedBoost: 22 },
      });

      currentZ -= aLen + 3;
    }

    // Dynamic Checkpoints (spaced evenly across the course)
    if (stageIdx === Math.floor(blueprint.length / 2) || (blueprint.length >= 8 && stageIdx === Math.floor(blueprint.length * 0.75))) {
      colliders.push({
        id: `l${id}_cp_${cpIndex}`,
        type: 'checkpoint',
        x: 0,
        y: currentY + 2.5,
        z: currentZ,
        width: 8,
        height: 4,
        depth: 3,
        metadata: { checkpointIndex: cpIndex },
      });
      cpIndex++;
    }
  });

  // Grand Finish Summit Platform
  const finishZ = currentZ - 10;
  const finishY = currentY + 2;

  // Final pre-finish lethal trap (rotates between Laser, Flame, Spiked Roller, or Sweeper)
  const preFinishTraps: Array<{ type: 'laser' | 'flamethrower' | 'roller_spikes' | 'laser_sweeper'; name: string; tip: string }> = [
    { type: 'laser', name: 'Rào Laser Cực Hạn', tip: 'Cú trượt dốc cuối cùng để chạm tay vào cổng chiến thắng!' },
    { type: 'flamethrower', name: 'Miệng Hỏa Ngục Đỉnh Núi', tip: 'Nhảy kép [Space x2] vút qua cột lửa đỉnh cao!' },
    { type: 'roller_spikes', name: 'Trục Gai Hộ Vệ', tip: 'Bật nhảy qua trục gai bảo vệ trước cổng về đích!' },
    { type: 'laser_sweeper', name: 'Laser Quét Đền Thờ', tip: 'Căn thời điểm nhảy qua lưỡi laser quét 360°!' },
  ];
  const finalTrap = preFinishTraps[(id - 1) % preFinishTraps.length];

  colliders.push({
    id: `l${id}_prefinish_trap`,
    type: 'hazard',
    x: 0,
    y: finishY + 2.0,
    z: finishZ - 2,
    width: 8,
    height: 0.35,
    depth: 0.35,
    metadata: {
      hazardType: finalTrap.type,
      hazardName: finalTrap.name,
      hazardTip: finalTrap.tip,
      rotating: finalTrap.type === 'laser_sweeper' ? { axis: 'y', speed: 3.0 } : undefined,
    },
  });

  colliders.push({
    id: `l${id}_finish_sanctuary`,
    type: 'ground',
    x: 0,
    y: finishY,
    z: finishZ - 8,
    width: id === 50 ? 20 : 16,
    height: 4,
    depth: id === 50 ? 24 : 20,
    color: palette.finishColor,
  });

  // Finish Gate Portal
  colliders.push({
    id: `l${id}_finish_gate`,
    type: 'finish',
    x: 0,
    y: finishY + 3.5,
    z: finishZ - 8,
    width: 10,
    height: 6,
    depth: 4,
  });

  // Framing monoliths for grand architectural depth
  colliders.push(
    {
      id: `l${id}_mono_1`,
      type: 'wall',
      x: -24,
      y: finishY + 15,
      z: finishZ / 2,
      width: 8,
      height: 80,
      depth: 8,
      color: palette.monolithColor,
    },
    {
      id: `l${id}_mono_2`,
      type: 'wall',
      x: 24,
      y: finishY + 20,
      z: finishZ + 10,
      width: 9,
      height: 90,
      depth: 9,
      color: palette.monolithColor,
    }
  );

  // Target times calculated realistically based on route distance
  const totalDist = Math.abs(finishZ);
  const goldTime = Math.round((totalDist / 9.5 + blueprint.length * 0.9) * 10) / 10;
  const silverTime = Math.round(goldTime * 1.45 * 10) / 10;
  const bronzeTime = Math.round(goldTime * 2.1 * 10) / 10;

  return {
    id: meta.id,
    slug: `level-${meta.id}`,
    name: meta.name,
    subtitle: meta.subtitle,
    description: meta.description,
    targetTimes: {
      gold: goldTime,
      silver: silverTime,
      bronze: bronzeTime,
    },
    spawnPoint: { x: 0, y: 1.5, z: 0 },
    spawnYaw: 0,
    finishPoint: { x: 0, y: finishY + 2, z: finishZ - 8 },
    skyTheme: meta.skyTheme,
    colliders,
  };
}

// Generate the complete list of 50 parkour levels
export const LEVELS: LevelDefinition[] = LEVEL_METAS.map((meta) => buildLevel(meta));

