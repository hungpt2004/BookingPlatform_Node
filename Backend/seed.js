// const mongoose = require("mongoose");
// const bed = require("./src/models/bed");
// const feedback = require("./src/models/feedback");
// const hotel = require("./src/models/hotel");
// const bed = require("./src/models/bed");
// const bed = require("./src/models/bed");
// const bed = require("./src/models/bed");
// const bed = require("./src/models/bed");
// const bed = require("./src/models/bed");
// const bed = require("./src/models/bed");
// const bed = require("./src/models/bed");

const feedbackContents = [
  "Dịch vụ tuyệt vời! Nhân viên thân thiện và hỗ trợ nhanh chóng.",
  "Khách sạn sạch sẽ, tiện nghi đầy đủ và rất thoải mái.",
  "Bữa sáng rất ngon, phòng có view đẹp và thoáng đãng.",
  "Trải nghiệm đáng nhớ, tôi sẽ quay lại lần sau!",
  "Giá cả hợp lý, vị trí trung tâm thuận tiện di chuyển.",
  "Hồ bơi sạch sẽ, nước ấm và có view rất đẹp.",
  "Phòng ốc rộng ốc rộng rãi, yên tĩnh và giường rất êm.",
  "Nhà hàng trong khách sạn có món ăn rất ngon.",
  "Khu vực lễ tân làm việc rất chuyên nghiệp và nhanh nhẹn.",
  "Khách sạn gần các điểm tham quan nổi tiếng, rất tiện lợi.",
];

const roomNames = [
  "Phòng Deluxe Hướng Biển",
  "Phòng Superior View Thành Phố",
  "Phòng Standard Giường Đôi",
  "Phòng Gia Đình Cao Cấp",
  "Suite Tổng Thống Sang Trọng",
  "Phòng Executive Hạng Nhất",
  "Phòng Tiết Kiệm Cho Cặp Đôi",
  "Phòng Premium Có Ban Công",
  "Phòng Cổ Điển với Nội Thất Gỗ",
  "Phòng Nghỉ Dưỡng Bên Hồ",
  "Phòng VIP Hạng Nhất",
  "Phòng Nghỉ Dưỡng Cao Cấp",
  "Phòng Tổng Thống",
  "Phòng Tiết Kiệm",
  "Phòng Căn Hộ Studio",
  "Phòng Gia Đình 4 Người",
  "Phòng Hướng Hồ",
  "Phòng Hướng Thành Phố",
  "Phòng Giường Đơn Cao Cấp",
  "Phòng Suite Hạng Sang",
];

const hotelDescriptions = [
  "Nằm ngay giữa trung tâm thành phố, khách sạn của chúng tôi mang đến một kỳ nghỉ sang trọng với các tiện nghi đẳng cấp thế giới, ẩm thực tinh tế và dịch vụ cá nhân hóa. Dù bạn đến đây vì công việc hay du lịch, hãy mong đợi một trải nghiệm tuyệt vời với tầm nhìn toàn cảnh thành phố và sự hiếu khách hàng đầu.",
  "Trải nghiệm vẻ đẹp lộng lẫy của sự sang trọng hoàng gia với các dịch vụ hàng đầu của chúng tôi. Từ những dãy phòng xa hoa đến các lựa chọn ẩm thực tinh tế, mọi chi tiết đều được chăm chút để đảm bảo một kỳ nghỉ đẳng cấp và đáng nhớ. Thư giãn tối đa với các dịch vụ spa và chăm sóc sức khỏe của chúng tôi.",
  "Một nơi nghỉ dưỡng yên bình, mang lại sự tĩnh lặng và thoải mái giữa nhịp sống sôi động của thành phố. Khách sạn có các phòng được trang bị nội thất thanh lịch, vườn thượng yên tĩnh và nhiều hoạt động giải trí giúp bạn thư giãn và tận hưởng kỳ nghỉ.",
  "Thiên đường bên bờ biển nơi du khách có thể thức dậy với tiếng sóng vỗ và ngắm bình minh tuyệt đẹp. Khu nghỉ dưỡng ven biển của chúng tôi có hồ bơi vô cực, các liệu pháp spa sang trọng và nhiều môn thể thao dưới nước để mang đến một kỳ nghỉ biển đáng nhớ.",
  "Một thiên đường trên cao mang đến tầm nhìn toàn cảnh tuyệt đẹp của đường chân trời thành phố. Dù bạn đang thưởng thức đồ uống tại quầy bar trên tầng thượng hay thư giãn trong dãy phòng sang trọng, khách sạn của chúng tôi mang đến sự kết hợp hoàn hảo giữa phong cách, thoải mái và tiện nghi.",
  "Trải nghiệm đẳng cấp dành riêng cho những du khách tìm kiếm sự sang trọng và tinh tế không gì sánh được. Khách sạn cung cấp quyền truy cập độc quyền vào các phòng chờ cao cấp, nhà hàng sang trọng và dịch vụ trợ lý riêng để đáp ứng mọi nhu cầu của bạn.",
  "Sự hòa quyện hoàn hảo giữa tiện nghi và phong cách, khách sạn của chúng tôi mang đến không gian ấm áp và chào đón cho cả khách du lịch và khách công tác. Tận hưởng trung tâm thể dục hiện đại, các liệu pháp spa thư giãn và ẩm thực tinh tế do các đầu bếp hàng đầu chuẩn bị.",
  "Định nghĩa tiêu chuẩn vàng của sự hiếu khách cao cấp, khách sạn của chúng tôi kết hợp giữa vẻ đẹp cổ điển và sự sang trọng hiện đại. Mỗi phòng đều được thiết kế tỉ mỉ với nội thất sang trọng, và các dịch vụ đặc trưng của chúng tôi đảm bảo một kỳ nghỉ tuyệt vời.",
  "Một ốc đảo đô thị dành cho những du khách hiện đại muốn tìm kiếm cả sự thư giãn và phiêu lưu. Với thiết kế đương đại, cơ sở vật chất tiên tiến và vị trí thuận tiện gần các điểm tham quan của thành phố, khách sạn của chúng tôi là lựa chọn lý tưởng cho một kỳ nghỉ đáng nhớ.",
  "Một trải nghiệm hoàng gia đang chờ đón bạn tại khu nghỉ dưỡng vườn xanh tươi của chúng tôi, nơi bạn có thể đắm chìm trong sự yên bình và sang trọng. Với khuôn viên được thiết kế tinh tế, spa đạt giải thưởng và ẩm thực đẳng cấp thế giới, khách sạn của chúng tôi là nơi nghỉ dưỡng lý tưởng cho những vị khách sành điệu.",
  "Khám phá một nơi nghỉ dưỡng trên núi, nơi không khí trong lành, phong cảnh ngoạn mục và chỗ ở ấm cúng tạo nên một kỳ nghỉ hoàn hảo. Thưởng thức các chuyến đi bộ đường dài, đốt lửa trại vào ban đêm và vẻ đẹp mộc mạc tại khu nghỉ dưỡng của chúng tôi.",
  "Bước vào thế giới của sự thanh lịch hiện đại tại khách sạn boutique phong cách của chúng tôi. Được thiết kế với nội thất đương đại, tiện nghi công nghệ cao và dịch vụ cá nhân hóa, đây là nơi hoàn hảo cho những du khách thành thị.",
  "Khu nghỉ dưỡng ven hồ của chúng tôi mang đến một kỳ nghỉ mê hoặc với khung cảnh thơ mộng, các môn thể thao dưới nước và ẩm thực cao cấp bên bờ hồ. Dù là kỳ nghỉ lãng mạn hay du lịch gia đình, đây là nơi hoàn hảo để thư giãn.",
  "Tận hưởng một kỳ nghỉ sa mạc đáng nhớ với lều sang trọng, cưỡi lạc đà và những đêm ngắm sao mê hoặc. Khu nghỉ dưỡng ốc đảo của chúng tôi mang đến sự kỳ diệu của những cồn cát với những trải nghiệm độc quyền.",
  "Trải nghiệm sự kết hợp giữa nét quyến rũ lịch sử và sự sang trọng hiện đại tại khách sạn di sản của chúng tôi. Với kiến trúc được bảo tồn cẩn thận và dịch vụ hàng đầu, đây là một kỳ nghỉ giàu văn hóa và tiện nghi.",
  "Một nơi nghỉ dưỡng nông thôn đầy quyến rũ, nơi những ngọn đồi xanh mướt, không khí trong lành và những căn nhà gỗ mộc mạc tạo nên một thiên đường yên bình tránh xa sự ồn ào của thành phố. Thưởng thức ẩm thực từ trang trại đến bàn ăn và những buổi dạo chơi thư thái giữa thiên nhiên.",
  "Một thiên đường đảo tư nhân độc quyền với các biệt thự riêng, làn nước trong xanh và các liệu pháp spa đẳng cấp thế giới. Một nơi trốn thoát thực sự dành cho những ai tìm kiếm sự riêng tư và thanh thản.",
  "Một khu nghỉ dưỡng trượt tuyết độc đáo với những cabin gỗ ấm cúng, đường trượt đầy thử thách và các dịch vụ sang trọng sau khi trượt tuyết. Hoàn hảo cho những người yêu thích thể thao mùa đông.",
  "Một viên ngọc văn hóa mang đến những trải nghiệm địa phương sâu sắc, từ các buổi biểu diễn truyền thống đến các lớp học nấu ăn thực hành. Hãy ở lại với chúng tôi và khám phá tinh hoa di sản sống động của vùng đất này.",
  "Một khu nghỉ dưỡng tập trung vào sức khỏe, ưu tiên chăm sóc sức khỏe và thư giãn của bạn. Với các khóa tu yoga, ẩm thực hữu cơ và liệu pháp spa toàn diện để trẻ hóa cơ thể và tâm trí.",
  "Một khách sạn tương lai kết hợp giữa công nghệ và sự sang trọng. Các phòng thông minh, dịch vụ AI và kiến trúc siêu hiện đại mang đến một trải nghiệm có một không hai.",
  "Một khách sạn casino sang trọng, nơi sự sôi động không bao giờ dừng lại. Tận hưởng trò chơi đẳng cấp thế giới, các chương trình giải trí hoành tráng và ẩm thực tinh tế dưới một mái nhà lộng lẫy.",
  "Nơi nghỉ dưỡng thân thiện với môi trường dành cho những du khách yêu thích sự bền vững mà không phải hy sinh sự sang trọng. Các phòng chạy bằng năng lượng mặt trời, ẩm thực hữu cơ và các sáng kiến xanh đang chờ đón bạn.",
  "Một khách sạn dưới nước, nơi bạn có thể nhìn thấy thế giới đại dương tuyệt đẹp ngay từ cửa sổ phòng của mình—thực sự là một trải nghiệm có một không hai.",
  "Một khách sạn kiểu cổ điển lấy cảm hứng từ những năm 1920, mang đến một chuyến du hành về thời hoàng kim của sự xa hoa, với các phòng chờ nhạc jazz và trang trí cổ điển.",
  "Một khách sạn theo chủ đề không gian đưa bạn vào hành trình liên thiên hà với thiết kế tương lai, giường lơ lửng và trải nghiệm không gian chân thực.",
  "Một khách sạn theo phong cách Hobbit, nơi mọi chi tiết đều được lấy cảm hứng từ thế giới giả tưởng—hoàn hảo cho những người hâm mộ những cuộc phiêu lưu huyền bí.",
  "Một khách sạn theo phong cách hoài cổ mang những năm 60, 70 và 80 trở lại cuộc sống với nội thất hoài cổ, âm nhạc và không khí cổ điển.",
  "Nằm ngay trung tâm thành phố, khách sạn của chúng tôi mang đến trải nghiệm sang trọng với tiện nghi đẳng cấp, ẩm thực tinh tế và dịch vụ cá nhân hóa.",
  "Trải nghiệm sự sang trọng của phong cách hoàng gia với các dịch vụ cao cấp nhất. Từ những căn suite lộng lẫy đến ẩm thực tinh tế, mọi chi tiết đều được chăm chút.",
  "Một khu nghỉ dưỡng yên bình mang lại sự thư thái giữa thành phố nhộn nhịp. Khách sạn có phòng được bài trí trang nhã, vườn trên sân thượng và nhiều hoạt động giải trí.",
  "Thiên đường bên bờ biển, nơi du khách thức dậy với tiếng sóng vỗ và ngắm bình minh tuyệt đẹp. Khu nghỉ dưỡng ven biển với hồ bơi vô cực và các liệu pháp spa sang trọng.",
  "Tòa nhà cao tầng mang đến tầm nhìn toàn cảnh tuyệt đẹp. Dù bạn thưởng thức đồ uống tại quán bar tầng thượng hay thư giãn trong phòng, khách sạn luôn đảm bảo sự thoải mái và tiện nghi.",
  "Một trải nghiệm đẳng cấp dành cho những du khách tìm kiếm sự xa hoa. Khách sạn cung cấp phòng chờ VIP, nhà hàng cao cấp và dịch vụ hỗ trợ cá nhân.",
  "Khách sạn kết hợp hoàn hảo giữa sự thoải mái và phong cách, mang đến không gian ấm cúng cho cả khách du lịch và công tác.",
  "Định nghĩa lại sự sang trọng với các phòng được thiết kế tinh tế, nội thất hiện đại và dịch vụ chăm sóc khách hàng chu đáo.",
  "Nơi trú ẩn giữa đô thị dành cho những du khách hiện đại. Thiết kế đương đại, tiện nghi hàng đầu và vị trí thuận tiện.",
  "Một trải nghiệm hoàng gia tại khu nghỉ dưỡng vườn xanh mát, nơi du khách có thể tận hưởng sự thư thái tuyệt đối.",
  "Khám phá kỳ nghỉ trên núi với không khí trong lành, phong cảnh ngoạn mục và những căn phòng ấm cúng.",
  "Khách sạn boutique phong cách hiện đại với trang trí sang trọng, tiện nghi công nghệ cao và dịch vụ cá nhân hóa.",
  "Khu nghỉ dưỡng ven hồ mang đến kỳ nghỉ tuyệt vời với phong cảnh thơ mộng, thể thao dưới nước và ẩm thực bên bờ hồ.",
  "Một ốc đảo giữa sa mạc với lều trại sang trọng, cưỡi lạc đà và những đêm sao trời tuyệt đẹp.",
  "Trải nghiệm sự quyến rũ cổ điển trong khách sạn di sản, nơi kiến trúc truyền thống kết hợp với sự tiện nghi hiện đại.",
  "Khu nghỉ dưỡng nông thôn yên bình giữa những ngọn đồi xanh mướt, mang đến không gian thư giãn hoàn hảo.",
  "Hòn đảo thiên đường với biệt thự riêng, nước biển trong xanh và các liệu pháp spa đẳng cấp thế giới.",
  "Một khu nghỉ dưỡng trượt tuyết tuyệt vời với những căn cabin gỗ ấm cúng và các đường trượt đẳng cấp.",
  "Một điểm đến văn hóa với trải nghiệm địa phương phong phú, từ các buổi biểu diễn truyền thống đến lớp học nấu ăn.",
  "Khu nghỉ dưỡng tập trung vào sức khỏe với các chương trình detox, yoga và spa toàn diện.",
  "Khách sạn hiện đại kết hợp công nghệ tiên tiến, phòng thông minh và dịch vụ AI tiện ích.",
  "Khách sạn sòng bạc xa hoa mang đến trải nghiệm giải trí đẳng cấp với các trò chơi và chương trình biểu diễn hấp dẫn.",
  "Một khu nghỉ dưỡng sinh thái dành cho những du khách yêu thiên nhiên, sử dụng năng lượng tái tạo và nguyên liệu hữu cơ.",
  "Kỳ nghỉ tại trang trại nho với những cánh đồng nho bạt ngàn và trải nghiệm nếm rượu vang hảo hạng.",
  "Một nhà nghỉ trong rừng nhiệt đới, nơi du khách có thể tham gia các chuyến safari và chiêm ngưỡng động vật hoang dã.",
  "Khách sạn nổi trên mặt nước mang đến trải nghiệm độc đáo trên du thuyền sang trọng.",
  "Một lâu đài cổ được cải tạo thành khách sạn xa hoa, nơi du khách có thể tận hưởng không gian hoàng gia đích thực.",
  "Một nhà nghỉ Bắc Cực, nơi bạn có thể chiêm ngưỡng ánh sáng phương Bắc từ căn lều kính ấm áp.",
  "Khách sạn mang phong cách nghệ thuật với mỗi căn phòng là một tác phẩm nghệ thuật độc đáo.",
  "Trải nghiệm ryokan truyền thống của Nhật Bản với suối nước nóng và các bữa ăn kaiseki tinh tế.",
  "Một khu nghỉ dưỡng thân thiện với thú cưng, nơi du khách có thể tận hưởng kỳ nghỉ cùng những người bạn bốn chân.",
  "Nghỉ dưỡng giữa rừng rậm, nơi bao quanh bởi cây xanh và thiên nhiên hoang sơ.",
  "Một khách sạn sang trọng mang phong cách thập niên 1920 với không gian hoài cổ đầy mê hoặc.",
  "Khu nghỉ dưỡng tối giản tập trung vào sự thư giãn, với không gian tĩnh lặng và gam màu trung tính.",
  "Khách sạn theo chủ đề âm nhạc với các phòng lấy cảm hứng từ những huyền thoại âm nhạc.",
  "Thiên đường dành cho những người yêu ẩm thực với những bữa ăn đẳng cấp và trải nghiệm nấu ăn độc đáo.",
  "Một trung tâm khách sạn dành cho doanh nhân với không gian làm việc hiện đại và kết nối internet tốc độ cao.",
  "Khách sạn lấy cảm hứng từ vũ trụ, mang đến không gian tương lai đầy sáng tạo.",
  "Một khu nghỉ dưỡng chuyên về chăm sóc sức khỏe với các liệu pháp hồi phục và hướng dẫn thiền định.",
  "Khách sạn dành riêng cho game thủ với phòng chơi game công nghệ cao và đấu trường esports.",
  "Khách sạn dưới nước mang đến trải nghiệm có một không hai với tầm nhìn tuyệt đẹp ra thế giới đại dương.",
  "Một khách sạn lấy cảm hứng từ Bollywood với các phòng theo chủ đề phim ảnh và chương trình biểu diễn trực tiếp.",
  "Một tu viện cổ được chuyển đổi thành khách sạn thanh tịnh dành cho du khách tìm kiếm sự bình yên.",
  "Khách sạn dành cho những người yêu sách, với thư viện khổng lồ và các phòng theo chủ đề văn học.",
  "Một khách sạn boutique phong cách thời trang, mang đến không gian đẳng cấp và sang trọng.",
  "Khách sạn lấy cảm hứng từ thế giới phép thuật, phù hợp với những ai yêu thích truyện cổ tích.",
  "Một khách sạn hoài cổ với phong cách retro của những năm 60, 70 và 80.",
];

const hotelNames = [
  "Luxe Haven Hotel",
  "Grand Imperial Hotel",
  "Serene Stay Inn",
  "Ocean Breeze Resort",
  "Skyline Suites",
  "Elite Retreat",
  "Harmony Hotel",
  "Golden Crest Hotel",
  "Urban Oasis Hotel",
  "Royal Garden Hotel",
  "Majestic Heights Hotel",
  "Tranquil Bay Resort",
  "Opulent Palace Hotel",
  "Silver Moon Inn",
  "Azure Waters Resort",
  "Sunset Serenity Hotel",
  "Paradise Cove Resort",
  "The Regal Manor",
  "Celestial Tower Hotel",
  "Elysium Grand Hotel",
  "Infinity View Hotel",
  "Prestige Plaza Hotel",
  "The Grand Monarch",
  "Horizon Bliss Resort",
  "Summit Peak Hotel",
  "Emerald Lagoon Hotel",
  "The Sapphire Retreat",
  "Radiance City Hotel",
  "Lavish Lagoon Resort",
  "Imperial Sun Hotel",
  "Diamond Coast Hotel",
  "Royal Orchid Resort",
  "Aqua Haven Hotel",
  "The Starlight Inn",
  "Whispering Pines Resort",
  "Timeless Elegance Hotel",
  "The Platinum Stay",
  "Crown Vista Hotel",
  "The Velvet Haven",
  "Zenith Skyline Hotel",
  "Pearl Essence Resort",
  "Majestic Riviera Hotel",
  "Blissful Horizon Inn",
  "Sunrise Splendor Hotel",
  "Grand Voyage Hotel",
  "Ethereal Charm Resort",
  "Golden Horizon Hotel",
  "Lush Retreat Hotel",
  "The Infinity Tower",
  "Opulence Suites",
  "Velvet Luxe Hotel",
  "Lighthouse Bay Resort",
  "Eden Garden Hotel",
  "The Summit Lounge",
  "Tranquility Resort",
  "Aurora Skyline Hotel",
  "Celeste Royale Hotel",
  "Mystic Valley Resort",
  "Celestial Breeze Hotel",
  "Serenade Heights",
  "The Grand Legacy",
  "Zen Retreat Hotel",
  "Blue Lagoon Resort",
  "Enchanted Cove Hotel",
  "Prestige Oceanfront",
  "Paradise Sands Hotel",
  "The Cosmopolitan Inn",
  "Moonlight Mirage Hotel",
  "Celestial View Hotel",
  "The Empress Suites",
  "Summit Crest Hotel",
  "Oasis Mirage Resort",
  "The Ivory Tower Hotel",
  "Heavenly Escape Hotel",
  "Breeze Bay Resort",
  "Grand Vista Inn",
  "Luminous Pearl Hotel",
  "The Majestic Wave",
  "Velvet Sky Resort",
  "Amber Palace Hotel",
  "Sky Haven Resort",
  "Regency Crown Hotel",
  "The Imperial Crest",
  "Sapphire Shores Hotel",
  "Gilded Rose Hotel",
  "Oceanfront Elegance",
  "Elite Harbor Resort",
  "The Zenith Palace",
  "Royal Mirage Hotel",
  "Serene Pearl Resort",
  "Whispering Waters Hotel",
  "Moonlit Haven Resort",
  "The Diamond Retreat",
  "Cascade Bliss Hotel",
  "The Heritage Grand",
  "Silver Crest Suites",
  "The Velvet Orchid",
  "Sunset Royal Hotel",
  "Azure Crest Hotel",
  "The Imperial Oasis",
  "Serene Harbour Resort",
  "The Celestial Crown",
];

const hotelAddresses = [
  "12 Đường Nguyễn Huệ, Quận 1, Hồ Chí Minh",
  "45 Lê Lợi, Quận 3, Hồ Chí Minh",
  "78 Hoàng Diệu, Quận 4, Hồ Chí Minh",
  "23 Trần Hưng Đạo, Quận 5, Hồ Chí Minh",
  "90 Phan Xích Long, Quận Phú Nhuận, Hồ Chí Minh",
  "56 Võ Văn Kiệt, Quận 2, Hồ Chí Minh",
  "34 Tôn Đức Thắng, Quận 7, Hồ Chí Minh",
  "67 Bùi Viện, Quận 1, Hồ Chí Minh",
  "11 Đinh Tiên Hoàng, Quận Bình Thạnh, Hồ Chí Minh",
  "102 Pasteur, Quận 3, Hồ Chí Minh",
  "15 Phố Tràng Tiền, Hoàn Kiếm, Hà Nội",
  "28 Hàng Bông, Hoàn Kiếm, Hà Nội",
  "55 Đường Kim Mã, Ba Đình, Hà Nội",
  "77 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
  "31 Trần Duy Hưng, Cầu Giấy, Hà Nội",
  "89 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
  "102 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
  "200 Bạch Đằng, Hải Châu, Đà Nẵng",
  "17 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
  "65 Phan Châu Trinh, Hải Châu, Đà Nẵng",
  "10 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ",
  "88 Lý Thái Tổ, Thành phố Buôn Ma Thuột, Đắk Lắk",
  "99 Trần Phú, Thành phố Nha Trang, Khánh Hòa",
  "120 Hùng Vương, Thành phố Huế, Thừa Thiên Huế",
  "35 Hoàng Diệu, Thành phố Vũng Tàu, Bà Rịa - Vũng Tàu",
  "50 Nguyễn Trãi, Thành phố Hạ Long, Quảng Ninh",
  "27 Lê Lợi, Thành phố Nam Định, Nam Định",
  "19 Lê Hồng Phong, Thành phố Hải Phòng, Hải Phòng",
  "65 Nguyễn Huệ, Thành phố Quy Nhơn, Bình Định",
  "44 Trần Hưng Đạo, Thành phố Phan Thiết, Bình Thuận",
  "78 Lê Duẩn, Thành phố Pleiku, Gia Lai",
  "101 Hoàng Quốc Việt, Thành phố Rạch Giá, Kiên Giang",
  "55 Võ Nguyên Giáp, Thành phố Đông Hà, Quảng Trị",
  "92 Trường Chinh, Thành phố Tuy Hòa, Phú Yên",
  "67 Nguyễn Thái Học, Thành phố Việt Trì, Phú Thọ",
  "81 Phạm Ngũ Lão, Thành phố Bắc Ninh, Bắc Ninh",
  "33 Hoàng Hoa Thám, Thành phố Lạng Sơn, Lạng Sơn",
  "48 Lý Tự Trọng, Thành phố Cao Lãnh, Đồng Tháp",
  "77 Nguyễn Văn Linh, Thành phố Bạc Liêu, Bạc Liêu",
  "25 Phạm Văn Đồng, Thành phố Hà Giang, Hà Giang",
  "90 Nguyễn Trường Tộ, Thành phố Điện Biên Phủ, Điện Biên",
  "12 Lê Quý Đôn, Thành phố Sơn La, Sơn La",
  "85 Hùng Vương, Thành phố Lai Châu, Lai Châu",
  "37 Trần Phú, Thành phố Tuyên Quang, Tuyên Quang",
  "98 Quang Trung, Thành phố Thái Nguyên, Thái Nguyên",
  "22 Nguyễn Du, Thành phố Bắc Giang, Bắc Giang",
  "47 Nguyễn Trãi, Thành phố Hòa Bình, Hòa Bình",
  "66 Hai Bà Trưng, Thành phố Yên Bái, Yên Bái",
  "38 Nguyễn Văn Cừ, Thành phố Lào Cai, Lào Cai",
  "72 Đường Trần Nhật Duật, Thành phố Thanh Hóa, Thanh Hóa",
  "41 Trần Quang Khải, Thành phố Vinh, Nghệ An",
  "17 Bạch Đằng, Thành phố Hà Tĩnh, Hà Tĩnh",
  "93 Lý Tự Trọng, Thành phố Đồng Hới, Quảng Bình",
  "58 Nguyễn Trãi, Thành phố Tam Kỳ, Quảng Nam",
  "79 Đinh Tiên Hoàng, Thành phố Quảng Ngãi, Quảng Ngãi",
  "102 Võ Văn Kiệt, Thành phố Kon Tum, Kon Tum",
  "36 Lê Thánh Tôn, Thành phố Gia Nghĩa, Đắk Nông",
  "24 Nguyễn Văn Linh, Thành phố Tuy Hòa, Phú Yên",
  "60 Ngô Quyền, Thành phố Bến Tre, Bến Tre",
  "99 Phạm Ngũ Lão, Thành phố Mỹ Tho, Tiền Giang",
  "42 Trần Phú, Thành phố Trà Vinh, Trà Vinh",
  "88 Hùng Vương, Thành phố Vĩnh Long, Vĩnh Long",
  "71 Lê Hồng Phong, Thành phố Long Xuyên, An Giang",
  "19 Hoàng Hoa Thám, Thành phố Cao Bằng, Cao Bằng",
  "53 Trần Hưng Đạo, Thành phố Bắc Kạn, Bắc Kạn",
  "40 Nguyễn Trường Tộ, Thành phố Lạng Sơn, Lạng Sơn",
  "82 Nguyễn Huệ, Thành phố Móng Cái, Quảng Ninh",
  "73 Lê Duẩn, Thành phố Châu Đốc, An Giang",
  "50 Nguyễn Thái Học, Thành phố Sóc Trăng, Sóc Trăng",
  "67 Trần Quang Diệu, Thành phố Hà Tiên, Kiên Giang",
  "28 Phan Bội Châu, Thành phố Cà Mau, Cà Mau",
  "37 Võ Thị Sáu, Thành phố Phan Rang-Tháp Chàm, Ninh Thuận",
  "99 Đường 30/4, Thành phố Tây Ninh, Tây Ninh",
  "56 Nguyễn Văn Cừ, Thành phố Tân An, Long An",
  "74 Nguyễn Văn Trỗi, Thành phố Đồng Xoài, Bình Phước",
  "92 Phạm Văn Đồng, Thành phố Hồng Ngự, Đồng Tháp",
  "85 Lê Lợi, Thành phố La Gi, Bình Thuận",
  "31 Nguyễn Hữu Thọ, Thành phố Cẩm Phả, Quảng Ninh",
  "46 Võ Thị Sáu, Thành phố Từ Sơn, Bắc Ninh",
  "108 Lê Hồng Phong, Thành phố Cam Ranh, Khánh Hòa",
];

const roomTypes = [
  "Deluxe Room",
  "Superior Room",
  "Standard Room",
  "Family Suite",
  "Presidential Suite",
  "Executive Suite",
  "Budget Room",
  "Premium Room",
  "Classic Room",
  "Resort Room",
  "Ocean View Room",
  "Garden View Room",
  "Luxury Villa",
  "Penthouse Suite",
  "Honeymoon Suite",
  "Business Room",
  "Economy Room",
  "Studio Room",
  "Bungalow",
  "Loft Room",
  "Cottage Room",
  "Heritage Room",
  "Glasshouse Suite",
  "Skyline Room",
  "Eco-Friendly Room",
  "Mountain View Room",
  "Sunset Suite",
  "Poolside Room",
  "Japanese Tatami Room",
  "Rustic Cabin",
  "King Suite",
  "Queen Suite",
  "Presidential Bungalow",
  "Royal Deluxe",
  "Luxury Apartment",
  "Private Villa",
  "Seaside Bungalow",
  "Sky Lounge Suite",
  "Horizon View Room",
  "Infinity Pool Room",
  "Hillside Retreat",
  "Riverfront Room",
  "Grand Family Suite",
  "Safari Lodge",
  "Modern Loft",
  "Chalet Room",
  "Zen Retreat",
  "Coastal Haven",
  "Cityscape Room",
  "Heritage Grand Suite",
  "Tropical Paradise Room",
  "Penthouse Pool Suite",
  "Golf View Room",
  "Art Deco Room",
  "Bohemian Loft",
  "Minimalist Studio",
  "Mediterranean Escape",
  "Balinese Bungalow",
  "Winter Wonderland Room",
  "Rainforest Retreat",
  "Lakeside Cabin",
  "Sky Garden Suite",
  "Infinity Sky Pool Suite",
  "Presidential Lakehouse",
  "Executive Business Suite",
  "Boutique Chic Room",
  "Historic Mansion Room",
  "Private Island Villa",
  "Ski Chalet Suite",
  "Eco Jungle Retreat",
  "Sunset Ocean Room",
  "Desert Luxury Tent",
  "Urban Loft Suite",
  "Royal Palace Suite",
  "Cosy Attic Room",
  "Romantic Hideaway",
  "Lighthouse Suite",
  "Futuristic Capsule Room",
  "Victorian Manor Room",
  "Serene Bamboo Retreat",
  "Old Town Classic",
  "Mountain Hideout",
  "Hidden Gem Suite",
  "Adventure Bunker",
  "Cave Room",
  "Treetop Bungalow",
  "Floating Water Villa",
  "Ice Hotel Room",
  "Yacht Cabin",
  "Cultural Heritage Room",
  "Garden Studio",
  "Safari Tent",
  "Urban Chic Apartment",
  "Convertible Space Room",
  "Designer Concept Suite",
  "Film-Inspired Suite",
  "Pop Art Loft",
  "Space-Themed Capsule",
  "Underwater Suite",
  "Music-Inspired Room",
  "High-Tech Smart Room",
  "Exotic Jungle Villa",
  "Desert Dome Room",
  "Private Pool Villa",
  "Artisan Crafted Room",
  "Baroque Palace Room",
  "Futuristic Pod Room",
  "Scandinavian Minimalist Room",
  "Industrial Loft",
  "Cozy Cabin Retreat",
  "Fireplace Family Room",
  "Royal Victorian Suite",
  "Penthouse Sky Deck",
  "Spa & Wellness Suite",
  "Lakeview Penthouse",
  "Crystal Clear Bubble Room",
  "Nature Lodge",
  "Luxury Tent Suite",
  "Hilltop Grand Room",
  "Farmhouse Retreat",
  "Beachfront Sanctuary",
  "Gothic Castle Suite",
  "Bubble Dome Experience",
  "Himalayan Hideout",
  "Asian Fusion Loft",
  "Secluded Mountain Lodge",
  "Mysterious Themed Room",
  "Space Capsule Pod",
  "Art Studio Loft",
  "Luxury Train Suite",
  "Cultural Fusion Room",
  "Neo-Classical Suite",
  "Sci-Fi Concept Room",
  "Nordic Escape Room",
  "Castle Chamber Suite",
  "Safari King Suite",
  "Vintage Parisian Room",
  "Classic European Manor",
  "Highland Cottage",
  "Royal Garden Villa",
  "Tuscany Inspired Room",
  "Waterfall View Retreat",
  "Zodiac-Themed Room",
  "Exotic Tribal Suite",
  "Moroccan Palace Room",
  "Venetian Royal Chamber",
  "Floating River Suite",
  "Cottagecore Dream Room",
  "Elegant Fountain Suite",
  "Chic Urban Loft",
  "Themed Movie Room",
  "Smart Home Suite",
  "Automated Robot Room",
  "Marble Palace Suite",
  "Aqua Dome Room",
  "Art Nouveau Suite",
  "Beachside Luxury Tent",
  "Cuban Colonial Suite",
  "Classic Wooden Cabin",
  "City Rooftop Suite",
  "Designer Concept Pod",
  "Infinity Horizon Room",
  "Smart Minimalist Room",
  "Eco Timber Lodge",
  "High-Tech VR Room",
  "Custom Dream Suite",
  "Scenic Safari Lodge",
  "Futuristic Glass Pod",
  "Sky-High Observatory Suite",
  "Vintage Tea Room",
  "Opulent Gilded Suite",
  "Alpine Adventure Lodge",
  "Starlit Glamping Dome",
  "Modern Zen Retreat",
  "Renaissance Grand Suite",
  "Mystical Library Room",
  "Private Rock Cave Suite",
  "Grand Art Gallery Suite",
  "Retro 70s Chic Room",
  "Space-Age Futuristic Loft",
  "Glamorous Penthouse Retreat",
  "Historic Sultan Suite",
  "Neon Cyberpunk Loft",
  "Wild West Cowboy Room",
  "Egyptian Pharaoh Suite",
  "Underground Hidden Den",
  "Frozen Ice Palace Room",
  "Grand Chessboard Suite",
  "Hobbit Hole Retreat",
  "Enchanted Forest Room",
  "Fairytale Castle Room",
  "Luxury Casino Suite",
  "Musical Concert Room",
  "Jungle Canopy Suite",
  "Theater-Inspired Suite",
  "Digital Detox Cabin",
  "Gaming Paradise Room",
  "Floating Eco Lodge",
  "Asian Tranquility Suite",
  "Hollywood Star Room",
  "Caribbean Beach Suite",
];

const roomDescriptions = [
  "Một căn phòng rộng rãi với tầm nhìn ra biển tuyệt đẹp.",
  "Phòng có tầm nhìn đẹp hướng thành phố và nội thất sang trọng.",
  "Căn phòng tiện nghi với giường đôi thoải mái.",
  "Lý tưởng cho gia đình với không gian rộng rãi và ấm cúng.",
  "Suite cao cấp với dịch vụ đặc quyền và không gian sang trọng.",
  "Trải nghiệm đẳng cấp với tiện nghi hạng nhất.",
  "Một lựa chọn tiết kiệm nhưng vẫn đảm bảo sự tiện nghi.",
  "Căn phòng cao cấp với ban công riêng.",
  "Không gian cổ điển với nội thất gỗ sang trọng.",
  "Nơi lý tưởng để nghỉ dưỡng với hồ bơi gần kề.",
  "Phòng VIP có tầm nhìn toàn cảnh thành phố về đêm.",
  "Căn phòng được trang bị nội thất da cao cấp.",
  "Phòng nghỉ dưỡng với phòng tắm phong cách spa.",
  "Suite đặc biệt với phòng tắm kính sang trọng.",
  "Căn phòng phong cách Nhật Bản với trải nghiệm truyền thống.",
  "Thiết kế hiện đại với giường king-size và bàn làm việc rộng.",
  "Không gian xanh với vườn nhỏ riêng biệt.",
  "Trải nghiệm yên tĩnh với cửa sổ cách âm.",
  "Phòng có khu vực tiếp khách riêng tư.",
  "Phòng biệt thự với lối đi thẳng ra bãi biển.",
];

const serviceDescriptions = [
  "Dịch vụ phòng 24/7 với đội ngũ nhân viên tận tâm.",
  "Wi-Fi tốc độ cao miễn phí trong toàn bộ khách sạn.",
  "Bữa sáng buffet đa dạng với các món ăn đặc sắc.",
  "Dịch vụ spa cao cấp giúp thư giãn sau một ngày dài.",
  "Hồ bơi vô cực với tầm nhìn toàn cảnh tuyệt đẹp.",
  "Trung tâm thể dục hiện đại với huấn luyện viên chuyên nghiệp.",
  "Dịch vụ giặt là nhanh chóng và tiện lợi.",
  "Xe đưa đón sân bay miễn phí cho khách lưu trú.",
  "Nhà hàng sang trọng với thực đơn đa dạng.",
  "Quầy bar trên tầng thượng với cocktail độc đáo.",
  "Dịch vụ đặt tour tham quan các địa danh nổi tiếng.",
  "Phòng hội nghị hiện đại dành cho các sự kiện quan trọng.",
  "Khu vui chơi dành riêng cho trẻ em.",
  "Dịch vụ hỗ trợ doanh nhân với không gian làm việc riêng.",
  "Bãi đỗ xe miễn phí và an toàn cho khách hàng.",
  "Dịch vụ gọi xe nhanh chóng và tiện lợi.",
  "Trải nghiệm bữa tối lãng mạn bên bờ biển.",
  "Dịch vụ mát-xa chuyên nghiệp giúp thư giãn cơ thể.",
  "Cửa hàng lưu niệm với các sản phẩm địa phương.",
  "Dịch vụ hỗ trợ 24/7 với đội ngũ nhân viên thân thiện.",
];

const roomImage = [
  "https://i.pinimg.com/736x/6c/88/6a/6c886a58955b62b80b29d29a69432904.jpg",
  "https://i.pinimg.com/736x/4b/72/21/4b722154dc3f319b1f8e9ac7c0a48d4f.jpg",
  "https://i.pinimg.com/736x/d2/0d/f6/d20df6973cf3f59e840e898a1462b2da.jpg",
  "https://i.pinimg.com/736x/7f/eb/63/7feb63a3026ec37bfc7d1d8ffe3dc873.jpg",
  "https://i.pinimg.com/736x/7f/eb/63/7feb63a3026ec37bfc7d1d8ffe3dc873.jpg",
  "https://i.pinimg.com/736x/ba/07/4b/ba074bf20e916723432ce1bb3df949ec.jpg",
  "https://i.pinimg.com/736x/ba/07/4b/ba074bf20e916723432ce1bb3df949ec.jpg",
  "https://i.pinimg.com/736x/e2/a8/ba/e2a8baa8d5a171e4c80725801b648e81.jpg",
  "https://i.pinimg.com/736x/29/44/39/294439b399dd8f9905d7dc04c5c58ce2.jpg",
  "https://i.pinimg.com/736x/11/49/fb/1149fb05369b91e4cb07fc85cc67426e.jpg",
  "https://i.pinimg.com/736x/1a/13/f9/1a13f9cc5a076c71449e2ffd7dcbfd94.jpg",
  "https://i.pinimg.com/736x/0b/ec/aa/0becaa9013e485340fc15704e8ea7bd5.jpg",
  "https://i.pinimg.com/736x/f7/ca/52/f7ca520754b7b1762a046fc32380beda.jpg",
  "https://i.pinimg.com/736x/53/f1/3d/53f13d79d88322ae511b5f2ed6aa90aa.jpg",
  "https://i.pinimg.com/736x/91/75/72/9175726f32ba9ef74fb7eab078d4c8c9.jpg",
  "https://i.pinimg.com/736x/44/2c/f0/442cf046ba3a72c97a3a406328a8604f.jpg",
  "https://i.pinimg.com/736x/82/85/41/82854152d968f7ecd7ab6a8134b9c801.jpg",
  "https://i.pinimg.com/736x/e2/b6/44/e2b644225297edc672c37475c2e71bd1.jpg",
  "https://i.pinimg.com/736x/89/7a/32/897a32e588f88300cc58fc696ed16e70.jpg",
  "https://i.pinimg.com/736x/e1/2b/1e/e12b1eef92fcbb8d148366a02a29d62b.jpg",
  "https://i.pinimg.com/736x/e9/40/4b/e9404b59bd7c3ec545b82be0def660f2.jpg",
  "https://i.pinimg.com/736x/34/fb/8e/34fb8e98222d0c6c1e617560c574b2b7.jpg",
  "https://i.pinimg.com/736x/58/52/f9/5852f9c6d22bbf48966279db9bd83be2.jpg",
  "https://i.pinimg.com/736x/d6/87/32/d687326d8acb084b6767ebfcef6b04d2.jpg",
  "https://i.pinimg.com/736x/56/d8/45/56d8450d55513d4e3b93877c708a47b4.jpg",
  "https://i.pinimg.com/736x/3e/32/ed/3e32ed6be00cdfdbe696736b93d14a74.jpg",
  "https://i.pinimg.com/736x/4e/d3/5c/4ed35c9263929654b9076cf8968047ae.jpg",
  "https://i.pinimg.com/736x/9a/76/1b/9a761b45824d60a117dc7a484cc5c93b.jpg",
  "https://i.pinimg.com/736x/72/94/b9/7294b9f07d5c8374552504a82ecc53cb.jpg",
  "https://i.pinimg.com/736x/4d/ee/19/4dee19b6b2af0c305f6e9b013fe18fdc.jpg",
  "https://i.pinimg.com/736x/85/9c/22/859c2298f64ef85e3b28d10b03f402bb.jpg",
  "https://i.pinimg.com/736x/4e/e1/d2/4ee1d24d87d37c5ddcab157af20d902e.jpg",
];

const hotelImage = [
  "https://i.pinimg.com/736x/8a/eb/20/8aeb20492a1c5dd51909352ea4f3c570.jpg",
  "https://i.pinimg.com/736x/c0/74/a3/c074a3d76474c26eb9694631edd6c59e.jpg",
  "https://i.pinimg.com/736x/10/1b/ae/101bae2e28dc30ea889ba93d6c058886.jpg",
  "https://i.pinimg.com/736x/3f/68/a8/3f68a890de2144e224e46fb21c756a41.jpg",
  "https://i.pinimg.com/736x/ab/5d/d4/ab5dd428955149bc39f3e92edbf01eb1.jpg",
  "https://i.pinimg.com/736x/22/7b/3b/227b3b3096fa77288e15617b4947af8b.jpg",
  "https://i.pinimg.com/736x/1e/82/db/1e82db2dfcee66dbd3dab40359a0533a.jpg",
  "https://i.pinimg.com/736x/96/4d/1d/964d1dc9693e6286c48a3f5cfd1cbbb0.jpg",
  "https://i.pinimg.com/736x/0a/4d/c3/0a4dc359a857b9c98fc7e0d99b8a80d5.jpg",
  "https://i.pinimg.com/736x/17/1e/af/171eaf32f503df8a085367a8bf155da9.jpg",
  "https://i.pinimg.com/736x/36/84/90/368490a019e5376e3fc21c0c5f2f5e92.jpg",
  "https://i.pinimg.com/736x/03/40/8b/03408b1ce609497438bb60a07a764398.jpg",
  "https://i.pinimg.com/736x/3f/64/c6/3f64c6d642c7128f11ee6ac26138407a.jpg",
  "https://i.pinimg.com/736x/89/c0/92/89c09207356de3fe14b7d5692c4a3411.jpg",
  "https://i.pinimg.com/736x/89/c0/92/89c09207356de3fe14b7d5692c4a3411.jpg",
  "https://i.pinimg.com/736x/5b/b5/08/5bb508fc74fd9864107216cf1e9ef450.jpg",
  "https://i.pinimg.com/736x/77/d1/74/77d17473cf4f1c3eb5aec7e381930025.jpg",
  "https://i.pinimg.com/736x/88/29/b1/8829b159416c99734c1b742be4ad9f09.jpg",
  "https://i.pinimg.com/736x/02/27/3f/02273f2568b055775825730c29f5001b.jpg",
  "https://i.pinimg.com/736x/da/fc/fa/dafcfa156af0f8c61036f9131c83fe20.jpg",
  "https://i.pinimg.com/736x/1a/b2/c7/1ab2c74722fc1a74d874af4071bede51.jpg",
  "https://i.pinimg.com/736x/4f/bd/68/4fbd684337df5152f4d6e33e4ff52b38.jpg",
  "https://i.pinimg.com/736x/6f/d1/2d/6fd12d8f7559c7a21c52aa782d22287f.jpg",
  "https://i.pinimg.com/736x/86/4d/4b/864d4beed3779d530b4388052d9b2cb6.jpg",
  "https://i.pinimg.com/736x/2b/46/fc/2b46fc944691029b2f49c5fa2eef893e.jpg",
  "https://i.pinimg.com/736x/42/04/c8/4204c8c328a8d86280dda711c545f9cf.jpg",
  "https://i.pinimg.com/736x/6a/aa/cd/6aaacd9a8009044b595ffcaa5aca7681.jpg",
  "https://i.pinimg.com/736x/2d/f6/11/2df6114307d9b93b925026b275b392a3.jpg",
  "https://i.pinimg.com/736x/cd/4e/a1/cd4ea1470db39a3c43021ab7d8a96db8.jpg",
  "https://i.pinimg.com/736x/6e/8a/c9/6e8ac97a5c24098c4844153b744fa2a4.jpg",
  "https://i.pinimg.com/736x/6e/8a/c9/6e8ac97a5c24098c4844153b744fa2a4.jpg",
  "https://i.pinimg.com/736x/fa/02/06/fa0206cb4a813d05f5b56dc1c4681a8b.jpg",
  "https://i.pinimg.com/736x/0e/97/13/0e971336348fabb5a30df2ca76b512dd.jpg",
  "https://i.pinimg.com/736x/ad/54/bf/ad54bf18bebd9d71103b68cee09fe6fb.jpg",
  "https://i.pinimg.com/736x/f3/3f/eb/f33feb864f7f72b753b48c8a9003d405.jpg",
  "https://i.pinimg.com/736x/1c/31/7c/1c317c4053b0835a3a54944ace8b66f0.jpg",
  "https://i.pinimg.com/736x/8a/eb/20/8aeb20492a1c5dd51909352ea4f3c570.jpg",
  "https://i.pinimg.com/736x/c0/74/a3/c074a3d76474c26eb9694631edd6c59e.jpg",
  "https://i.pinimg.com/736x/10/1b/ae/101bae2e28dc30ea889ba93d6c058886.jpg",
  "https://i.pinimg.com/736x/3f/68/a8/3f68a890de2144e224e46fb21c756a41.jpg",
  "https://i.pinimg.com/736x/ab/5d/d4/ab5dd428955149bc39f3e92edbf01eb1.jpg",
  "https://i.pinimg.com/736x/22/7b/3b/227b3b3096fa77288e15617b4947af8b.jpg",
  "https://i.pinimg.com/736x/1e/82/db/1e82db2dfcee66dbd3dab40359a0533a.jpg",
  "https://i.pinimg.com/736x/96/4d/1d/964d1dc9693e6286c48a3f5cfd1cbbb0.jpg",
  "https://i.pinimg.com/736x/0a/4d/c3/0a4dc359a857b9c98fc7e0d99b8a80d5.jpg",
  "https://i.pinimg.com/736x/17/1e/af/171eaf32f503df8a085367a8bf155da9.jpg",
  "https://i.pinimg.com/736x/36/84/90/368490a019e5376e3fc21c0c5f2f5e92.jpg",
  "https://i.pinimg.com/736x/03/40/8b/03408b1ce609497438bb60a07a764398.jpg",
  "https://i.pinimg.com/736x/3f/64/c6/3f64c6d642c7128f11ee6ac26138407a.jpg",
  "https://i.pinimg.com/736x/89/c0/92/89c09207356de3fe14b7d5692c4a3411.jpg",
  "https://i.pinimg.com/736x/89/c0/92/89c09207356de3fe14b7d5692c4a3411.jpg",
  "https://i.pinimg.com/736x/5b/b5/08/5bb508fc74fd9864107216cf1e9ef450.jpg",
  "https://i.pinimg.com/736x/77/d1/74/77d17473cf4f1c3eb5aec7e381930025.jpg",
  "https://i.pinimg.com/736x/88/29/b1/8829b159416c99734c1b742be4ad9f09.jpg",
  "https://i.pinimg.com/736x/02/27/3f/02273f2568b055775825730c29f5001b.jpg",
  "https://i.pinimg.com/736x/da/fc/fa/dafcfa156af0f8c61036f9131c83fe20.jpg",
  "https://i.pinimg.com/736x/1a/b2/c7/1ab2c74722fc1a74d874af4071bede51.jpg",
  "https://i.pinimg.com/736x/4f/bd/68/4fbd684337df5152f4d6e33e4ff52b38.jpg",
  "https://i.pinimg.com/736x/6f/d1/2d/6fd12d8f7559c7a21c52aa782d22287f.jpg",
  "https://i.pinimg.com/736x/86/4d/4b/864d4beed3779d530b4388052d9b2cb6.jpg",
  "https://i.pinimg.com/736x/2b/46/fc/2b46fc944691029b2f49c5fa2eef893e.jpg",
  "https://i.pinimg.com/736x/42/04/c8/4204c8c328a8d86280dda711c545f9cf.jpg",
  "https://i.pinimg.com/736x/6a/aa/cd/6aaacd9a8009044b595ffcaa5aca7681.jpg",
  "https://i.pinimg.com/736x/2d/f6/11/2df6114307d9b93b925026b275b392a3.jpg",
  "https://i.pinimg.com/736x/cd/4e/a1/cd4ea1470db39a3c43021ab7d8a96db8.jpg",
  "https://i.pinimg.com/736x/6e/8a/c9/6e8ac97a5c24098c4844153b744fa2a4.jpg",
  "https://i.pinimg.com/736x/6e/8a/c9/6e8ac97a5c24098c4844153b744fa2a4.jpg",
  "https://i.pinimg.com/736x/fa/02/06/fa0206cb4a813d05f5b56dc1c4681a8b.jpg",
  "https://i.pinimg.com/736x/0e/97/13/0e971336348fabb5a30df2ca76b512dd.jpg",
  "https://i.pinimg.com/736x/ad/54/bf/ad54bf18bebd9d71103b68cee09fe6fb.jpg",
  "https://i.pinimg.com/736x/f3/3f/eb/f33feb864f7f72b753b48c8a9003d405.jpg",
  "https://i.pinimg.com/736x/1c/31/7c/1c317c4053b0835a3a54944ace8b66f0.jpg",
];

const servicesName = [
  "Free Wi-Fi",
  "Airport Shuttle",
  "24/7 Room Service",
  "Spa and Wellness Center",
  "Swimming Pool",
  "Fitness Center",
  "Conference Rooms",
  "Laundry Service",
  "Car Rental",
  "Restaurant and Bar",
];

//Bỏ Facility dùng HotelFacility - bỏ trường HotelID
//Bỏ RoomID trong roomFacility

// Reset database

//Tự tạo USER nếu chạy local
const userIds = [
  ObjectId("67ac892aba1cb210b487e1e1"),
  ObjectId("67ac894aba1cb210b487e1e7"),
  ObjectId("67ac8964ba1cb210b487e1ec"),
  ObjectId("67acdfeff66207b09a81549c"),
  ObjectId("67bd52d03c1c55ad7095f992"),
  ObjectId("67cbcd398671a70c4a16c8de"),
  ObjectId("67d1b826c6300105c99dd185"),
];

const hotelIds = [];
const serviceIds = [];
const roomIds = [];
const reservationIds = [];
const hotelfacilityIds = [];
const roomFacilityIds = [];

// Danh sách loại giường cố định
const bedTypes = [
  {
    name: "Giường đơn",
    description: "Giường đơn thoải mái, thích hợp cho một người.",
  },
  {
    name: "Giường đôi",
    description: "Giường đôi rộng rãi, phù hợp cho 2 người.",
  },
  {
    name: "Giường 4 người",
    description: "Giường lớn có thể chứa đến 4 người.",
  },
  {
    name: "2 giường đơn",
    description: "Phòng có 2 giường đơn, phù hợp cho nhóm 2 người.",
  },
];

// Insert Beds
const bedDocs = db.beds.insertMany(bedTypes);
const bedIds = Object.values(bedDocs.insertedIds);

// Danh sách facility có sẵn
const facilitiesName = [
  "Wi-Fi miễn phí",
  "Hồ bơi",
  "Bãi đỗ xe",
  "Dịch vụ phòng 24/7",
  "Nhà hàng",
  "Trung tâm thể hình",
];

const facilitiesDescriptions = [
  "Internet tốc độ cao miễn phí cho khách hàng.",
  "Hồ bơi rộng rãi, sạch sẽ và hiện đại.",
  "Bãi đỗ xe miễn phí dành cho khách hàng lưu trú.",
  "Hỗ trợ dịch vụ phòng mọi lúc.",
  "Nhà hàng phục vụ đa dạng món ăn ngon.",
  "Phòng tập gym đầy đủ trang thiết bị hiện đại.",
];

const roomFacilitiesName = [
  "Air Conditioning",
  "Flat-screen TV",
  "Mini Bar",
  "Private Bathroom",
  "Coffee Maker",
  "High-speed Wi-Fi",
  "In-room Safe",
  "Work Desk",
  "Soundproofing",
  "Balcony",
];

const roomFacilitiesDescriptions = [
  "Cung cấp không khí mát mẻ và thoải mái vào những ngày nóng.",
  "Thưởng thức các chương trình yêu thích trên màn hình độ nét cao.",
  "Có sẵn các món ăn nhẹ và đồ uống.",
  "Bao gồm vòi sen, bồn tắm và đồ dùng vệ sinh miễn phí.",
  "Pha cà phê tươi ngay trong phòng của bạn.",
  "Kết nối internet nhanh và ổn định.",
  "Lưu trữ an toàn đồ có giá trị và tài liệu quan trọng.",
  "Không gian làm việc tiện lợi cho khách công tác.",
  "Đảm bảo kỳ nghỉ yên tĩnh và thư giãn.",
  "Tận hưởng không gian ngoài trời riêng với tầm nhìn đẹp.",
];

//Tránh giá trị trùng lặp và tạo đủ với dữ liệu
let insertedRoomFacilities = new Set();

//Insert Room Facility
for (let i = 0; i < roomFacilitiesName.length; i++) {
  let facilityName = roomFacilitiesName[i]; // Kiểm tra nếu chưa tồn tại mới insert

  if (!insertedRoomFacilities.has(facilityName)) {
    let roomFacility = db.roomfacilities.insertOne({
      name: facilityName,
      description: roomFacilitiesDescriptions[i],
    });

    roomFacilityIds.push(roomFacility.insertedId);
    insertedRoomFacilities.add(facilityName);
  }
}

//Insert facility
let insertedFacilities = new Set();

for (let i = 0; i < facilitiesName.length; i++) {
  let facilityName = facilitiesName[i]; // Kiểm tra nếu chưa tồn tại mới insert

  if (!insertedFacilities.has(facilityName)) {
    let facility = db.hotelfacilities.insertOne({
      name: facilityName,
      description: facilitiesDescriptions[i],
    });

    hotelfacilityIds.push(facility.insertedId);
    insertedFacilities.add(facilityName);
  }
}

//Inser hotel service
for (let i = 0; i < servicesName.length; i++) {
  let randomIndex = i % servicesName.length;
  let randomPrice = Math.floor(Math.random() * 5000) + 1000; // **🛑 Kiểm tra dịch vụ có bị trùng không trước khi insert**

  let existingService = db.hotelservices.findOne({ name: servicesName[i] });

  if (!existingService) {
    let hotelService = db.hotelservices.insertOne({
      name: servicesName[randomIndex],
      description: roomDescriptions[randomIndex],
      price: randomPrice,
    }); // Lưu ID để sử dụng sau này

    serviceIds.push(hotelService.insertedId);
  }
}

//Insert hotel
for (let i = 0; i < 60; i++) {
  let randomIndex = i % hotelNames.length;

  let hotelFacilityIds = hotelfacilityIds
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 3);

  let hotelServiceIds = serviceIds
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 3);

  let images = [];
  let numImages = Math.floor(Math.random() * 8) + 4; // 4-11 hình ảnh mỗi khách sạn
  for (let k = 0; k < numImages; k++) {
    let hotelImageUrl =
      hotelImage[Math.floor(Math.random() * hotelImage.length)];
    images.push(hotelImageUrl);
  } // **🛑 Kiểm tra khách sạn có bị trùng không trước khi insert**

  let existingHotel = db.hotels.findOne({
    hotelName: hotelNames[i],
    address: hotelAddresses[i],
  });

  if (!existingHotel) {
    let hotel = db.hotels.insertOne({
      hotelName: hotelNames[i],
      owner: userIds[i % userIds.length],
      description: hotelDescriptions[randomIndex],
      address: hotelAddresses[i],
      adminStatus: "APPROVED",
      ownerStatus: "ACTIVE",
      services: hotelServiceIds,
      facilities: hotelFacilityIds,
      star: Math.floor(Math.random() * 4) + 2, // 2-5 sao
      rating: Math.floor(Math.random() * 5) + 1, // 1-5 rating
      pricePerNight: Math.floor(Math.random() * 20000) + 5000, // 5000 - 25000
      images: images,
    });

    hotelIds.push(hotel.insertedId);
  }
}

for (let i = 0; i < 50; i++) {
  for (let j = 0; j < 3; j++) {
    let selectedBeds = Array.from({ length: 3 }, () => ({
      bed: bedIds[Math.floor(Math.random() * bedIds.length)],
      quantity: Math.floor(Math.random() * 3) + 1,
    }));

    let images = [];
    let numImages = Math.floor(Math.random() * 4) + 2; // Chọn ngẫu nhiên từ 1-3 hình ảnh cho mỗi phòng
    for (let k = 0; k < numImages; k++) {
      let randomImage = roomImage[Math.floor(Math.random() * roomImage.length)];
      images.push(randomImage);
    }

    let shuffledFacilities = hotelfacilityIds
      .map((facility) => ({ facility, sort: Math.random() })) // Thêm giá trị ngẫu nhiên
      .sort((a, b) => a.sort - b.sort) // Sắp xếp theo giá trị ngẫu nhiên
      .slice(0, Math.floor(Math.random() * 3) + 3) // Chọn từ 3-5 phần tử
      .map(({ facility }) => facility); // Lấy lại giá trị gốc

    let room = db.rooms.insertOne({
      name: roomNames[Math.floor(Math.random() * roomNames.length)],
      type: roomTypes[Math.floor(Math.random() * roomTypes.length)],
      price: Math.floor(Math.random() * 10000) + 2000,
      capacity: Math.floor(Math.random() * 4) + 1,
      description:
        roomDescriptions[Math.floor(Math.random() * roomDescriptions.length)],
      images: images,
      facilities: shuffledFacilities,
      quantity: Math.floor(Math.random() * 5) + 1,
      hotel: hotelIds[i % hotelIds.length],
      bed: selectedBeds,
    });
    roomIds.push(room.insertedId);
  }
}

// Insert 100 hotels (Mỗi khách sạn có 5 ảnh và 3-5 facility)
for (let i = 0; i < hotelNames.length; i++) {
  let randomIndex = i % hotelNames.length;

  let hotelFacilityIds = hotelfacilityIds
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 3);

  let hotelServiceIds = serviceIds
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 3);

  let images = [];
  let numImages = Math.floor(Math.random() * 8) + 4; // 4-11 hình ảnh mỗi khách sạn
  for (let k = 0; k < numImages; k++) {
    let hotelImageUrl =
      hotelImage[Math.floor(Math.random() * hotelImage.length)];
    images.push(hotelImageUrl);
  } // **🛑 Kiểm tra khách sạn có bị trùng không trước khi insert**

  let existingHotel = db.hotels.findOne({
    hotelName: hotelNames[i],
    address: hotelAddresses[i],
  });

  if (!existingHotel) {
    let hotel = db.hotels.insertOne({
      hotelName: hotelNames[i],
      owner: userIds[i % userIds.length],
      description: hotelDescriptions[randomIndex],
      address: hotelAddresses[i],
      adminStatus: "APPROVED",
      ownerStatus: "ACTIVE",
      services: hotelServiceIds,
      facilities: hotelFacilityIds,
      star: Math.floor(Math.random() * 4) + 2, // 2-5 sao
      rating: Math.floor(Math.random() * 5) + 1, // 1-5 rating
      pricePerNight: Math.floor(Math.random() * 20000) + 5000, // 5000 - 25000
      images: images,
    });

    hotelIds.push(hotel.insertedId);
  }
}

// Insert 60 rooms (Mỗi phòng có 3 ảnh)
for (let i = 0; i < 20; i++) {
  for (let j = 0; j < 3; j++) {
    let selectedBeds = Array.from({ length: 3 }, () => ({
      bed: bedIds[Math.floor(Math.random() * bedIds.length)],
      quantity: Math.floor(Math.random() * 3) + 1,
    }));

    let images = [];
    let numImages = Math.floor(Math.random() * 4) + 2; // Chọn ngẫu nhiên từ 1-3 hình ảnh cho mỗi phòng
    for (let k = 0; k < numImages; k++) {
      let randomImage = roomImage[Math.floor(Math.random() * roomImage.length)];
      images.push(randomImage);
    }

    let shuffledFacilities = hotelfacilityIds
      .map((facility) => ({ facility, sort: Math.random() })) // Thêm giá trị ngẫu nhiên
      .sort((a, b) => a.sort - b.sort) // Sắp xếp theo giá trị ngẫu nhiên
      .slice(0, Math.floor(Math.random() * 3) + 3) // Chọn từ 3-5 phần tử
      .map(({ facility }) => facility); // Lấy lại giá trị gốc

    let room = db.rooms.insertOne({
      name: roomNames[Math.floor(Math.random() * roomNames.length)],
      type: roomTypes[Math.floor(Math.random() * roomTypes.length)],
      price: Math.floor(Math.random() * 10000) + 2000,
      capacity: Math.floor(Math.random() * 4) + 1,
      description:
        roomDescriptions[Math.floor(Math.random() * roomDescriptions.length)],
      images: images,
      quantity: Math.floor(Math.random() * 10) + 1,
      hotel: hotelIds[i % hotelIds.length],
      facilities: shuffledFacilities,
      bed: selectedBeds,
    });
    roomIds.push(room.insertedId);
  }
}

// Trạng thái của Reservation
const reservationStatuses = [
  "BOOKED",       // Đã đặt, trả tiền nhưng chưa check-in
  "CHECKED IN",   // Đang ở, đã check-in
  "CHECKED OUT",  // Đã check-out, có thể để lại phản hồi
  "COMPLETED",    // Hoàn thành, đã phản hồi
  "PENDING",      // Chờ xử lý hoặc xác nhận
  "CANCELLED",    // Đã hủy
  "NOT PAID",     // Chưa trả tiền
];

for (let i = 0; i < 300; i++) {
  // Chọn trạng thái ngẫu nhiên
  let randomStatus =
    reservationStatuses[Math.floor(Math.random() * reservationStatuses.length)];

  // Chọn 3 phòng ngẫu nhiên từ roomIds
  let selectedRoomIds = [];
  while (selectedRoomIds.length < 3) {
    let randomRoom = roomIds[Math.floor(Math.random() * roomIds.length)];
    if (selectedRoomIds.indexOf(randomRoom) === -1) {
      selectedRoomIds.push(randomRoom);
    }
  }

  let selectedRooms = [];
  for (let j = 0; j < selectedRoomIds.length; j++) {
    selectedRooms.push({
      room: selectedRoomIds[j],
      quantity: Math.floor(Math.random() * 3) + 1, // Số lượng phòng từ 1 đến 3
    });
  }

  // Thiết lập ngày check-in và check-out ngẫu nhiên
  let checkInDate = new Date(2025, 0, 1 + Math.floor(Math.random() * 365));
  let checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkOutDate.getDate() + Math.floor(Math.random() * 7) + 1);
  let numNights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let totalPrice = 0;

  // Lấy thông tin khách sạn theo thứ tự (liên kết giữa hotel và reservation)
  let hotelId = hotelIds[i % hotelIds.length];
  let hotelData = db.hotels.findOne({ _id: hotelId });
  let hotelPricePerNight = hotelData ? hotelData.pricePerNight || 0 : 0;

  // Tính tổng giá từ các phòng được chọn
  for (let k = 0; k < selectedRooms.length; k++) {
    let roomData = db.rooms.findOne({ _id: selectedRooms[k].room });
    let roomPrice = roomData ? roomData.price : 0;
    totalPrice += roomPrice * selectedRooms[k].quantity * numNights;
  }

  // Cộng thêm giá khách sạn theo đêm
  totalPrice += hotelPricePerNight * numNights;

  // Kiểm tra nếu tổng giá là NaN
  if (isNaN(totalPrice)) {
    console.error(`❌ Lỗi: totalPrice = NaN tại lượt thứ ${i + 1}`);
    console.error({
      checkInDate,
      checkOutDate,
      numNights,
      selectedRooms,
      hotelPricePerNight,
      totalPrice,
    });
    continue; // Bỏ qua insert nếu có lỗi
  }

  // Insert reservation với trạng thái ngẫu nhiên
  let reservation = db.reservations.insertOne({
    user: userIds[i % userIds.length],
    hotel: hotelId,
    rooms: selectedRooms,
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    status: randomStatus,
    totalPrice: totalPrice,
  });

  reservationIds.push(reservation.insertedId);
}


// Insert 10 Feedbacks - chỉ áp dụng với reservation có trạng thái hợp lệ
reservationIds.forEach((resId) => {
  let reservation = db.reservations.findOne({ _id: resId });
  if (reservation && reservation.status === "COMPLETED") {
    db.feedbacks.insertOne({
      user: reservation.user,           // Lấy thông tin user từ reservation
      reservation: resId,
      hotel: reservation.hotel,         // Lấy thông tin khách sạn từ reservation
      content: feedbackContents[Math.floor(Math.random() * feedbackContents.length)],
      rating: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date(),
    });
  }
});


// const feedbackSet = new Set();
// for (let i = 0; i < 400; i++) {
//   let randomIndex = i % feedbackContents.length;
//   let userId = userIds[i % userIds.length];
//   let hotelId = hotelIds[i % hotelIds.length];

//   let reservation = db.reservations.findOne({ _id: reservationIds[i] }); // Chỉ cho phép feedback với reservation có trạng thái CHECKED OUT hoặc COMPLETED

//   if (["COMPLETED"].includes(reservation.status)) {
//     let feedbackKey = `${userId}-${hotelId}`;
//     if (!feedbackSet.has(feedbackKey)) {
//       db.feedbacks.insertOne({
//         user: userId,
//         reservation: reservationIds[i],
//         hotel: hotelId,
//         content: feedbackContents[randomIndex],
//         rating: Math.floor(Math.random() * 5) + 1,
//         createdAt: new Date(),
//       });
//       feedbackSet.add(feedbackKey);
//     }
//   }
// }
