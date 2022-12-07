import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Text,
  AspectRatio,
  Heading,
  Stack,
  Divider,
  Highlight,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@chakra-ui/react';
import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { withProse, Prose } from '@nikolovlazar/chakra-ui-prose';
import Link from 'next/link';

export interface IDiscoveryCountryProps {}

const temp = `<div>
<h3 style="margin-left:0px;"><strong>1. Tổng Quan</strong></h3>
<h3 style="margin-left:1em;"><strong>1. ĐỊA LÝ</strong></h3>
<p style="margin-left:1em;">Do địa hình hẹp, Việt Nam phản ánh các phong tục, tập quán khác nhau của đất nước này từ
  nam ra bắc.&nbsp;Có nhiều cảnh đẹp ngoạn mục của những ngọn núi và khung cảnh bãi biển thư giãn và thoải mái. Nhiều
  thành phố kết hợp bí ẩn của phương Đông với sự lãng mạn của Pháp. Năm danh lam thắng cảnh được UNESCO liệt kê là di
  sản văn hóa và tự nhiên của UNESCO; Có nhiều sản phẩm nông nghiệp ở Việt Nam, và trái cây rẻ và tốt. Hải sản ở đây
  cũng là món khoái khẩu của khách du lịch. Giá gần như thấp nhất trong số các nước Đông Nam Á.</p>
<h3 style="margin-left:1em;"><strong>2. THỜI TIẾT</strong></h3>
<ul>
  <li>Tháng 11 - 2&nbsp;là thời điểm tốt nhất để du lịch tại Việt Nam.</li>
  <li>Việt Nam được chia thành mùa khô và mùa mưa. Mùa khô là từ tháng 1 đến tháng 4 và khí hậu khô. Mùa khô được chia
    thành mùa nóng và mùa mát. Mùa nóng là từ tháng 1 đến tháng 2 và mùa nóng từ tháng 3 đến tháng 4.</li>
  <li>Tháng 11 - Tháng 2 năm sau&nbsp;: Đó là mùa mát mẻ vào mùa khô của Việt Nam, và thời tiết tương đối mát
    mẻ.&nbsp;Đồng thời, trong thời gian này, đó cũng là khoảng thời gian để các lễ hội Việt Nam tụ họp lại. Vào tháng
    1, lễ hội hoa Daban, lễ hội mùa xuân vào tháng 2, v.v., du khách có thể dễ dàng cảm nhận phong cách Việt Nam chân
    thực hơn trong lễ hội.</li>
  <li>Tháng 3-Tháng 4&nbsp;: Đó là mùa nóng vào mùa khô ở Việt Nam. Thời tiết rất nóng và mặt trời rất mạnh. Rất dễ bị
    cháy nắng.</li>
  <li>Tháng 5-Tháng 10:&nbsp;từ tháng năm đến tháng mười là mùa mưa, mưa bất cứ lúc nào, chủ yếu là mưa lớn và mưa xối
    xả, độ ẩm cao, trong khi khu vực ven biển có thể gặp phải một cơn bão.&nbsp;Nếu bạn đi lần này, nó có thể có tác
    động nhất định đến hành trình.</li>
</ul>
<h3 style="margin-left:1em;"><strong>3. MÚI GIỜ</strong></h3>
<p style="margin-left:1em;">UTC +7</p>
<h3 style="margin-left:1em;"><strong>4. VĂN HÓA</strong></h3>
<p style="margin-left:1em;">Những vùng có những nét văn hóa đặc trưng tại Việt Nam. Từ vùng&nbsp;đồng bằng sông
  Hồng&nbsp;với văn hóa làng xã và văn minh lúa nước, đến những sắc thái văn hóa các dân tộc miền núi tại&nbsp;tây
  bắc&nbsp;và&nbsp;đông bắc. Từ vùng biên viễn các triều đại miền Bắc đến nền văn hóa&nbsp;Chăm Pa&nbsp;của&nbsp;người
  Chăm&nbsp;Nam Trung Bộ&nbsp;cùng vùng đất mới ở&nbsp;Nam Bộ&nbsp;kết hợp văn hóa các tộc&nbsp;người Hoa,&nbsp;người
  Khmer&nbsp;và các bộ tộc&nbsp;Tây Nguyên.</p>
<p style="margin-left:1em;">54 dân tộc có những&nbsp;phong tục, những&nbsp;lễ hội&nbsp;mang ý nghĩa sinh hoạt cộng
  đồng,&nbsp;tín ngưỡng, sự khoan dung trong tư tưởng&nbsp;tôn giáo, tính cặn kẽ và ẩn dụ trong&nbsp;ngôn ngữ&nbsp;từ
  truyền thống đến hiện đại của&nbsp;văn học,&nbsp;nghệ thuật. Với lịch sử hàng nghìn năm hội tụ các dân tộc, từ văn
  hóa bản địa thời&nbsp;Hồng Bàng&nbsp;đến những ảnh hưởng từ xa xưa của&nbsp;Trung Quốc&nbsp;và&nbsp;Đông Nam
  Á&nbsp;đến những ảnh hưởng của&nbsp;Pháp&nbsp;thế kỷ XIX,&nbsp;phương Tây&nbsp;trong thế kỷ XX và&nbsp;toàn cầu
  hóa&nbsp;từ thế kỷ XXI, Việt Nam đã có những thay đổi về văn hóa theo các thời kỳ lịch sử.</p>
<h3 style="margin-left:1em;"><strong>5. NGÔN NGỮ</strong></h3>
<p style="margin-left:1em;">Tiếng Việt&nbsp;</p>
<p style="margin-left:1em;">Tiếng Việt là&nbsp;tiếng mẹ đẻ&nbsp;của hơn 85% dân cư Việt Nam và ngôn ngữ thứ hai của
  các dân tộc thiểu số. Tiếng Việt ở Việt Nam trước đây chủ yếu dùng&nbsp;chữ Nôm&nbsp;để viết. Văn tự tiếng Việt ngày
  nay chủ yếu là&nbsp;chữ Quốc ngữ Latinh&nbsp;do các tu sĩ Dòng Tên sáng tạo. Bên cạnh đó, Việt Nam có các ngôn ngữ
  thiểu số thuộc các ngữ hệ&nbsp;Nam Á,&nbsp;Nam Đảo,&nbsp;Hán-Tạng,&nbsp;Tai-Kadai, và&nbsp;H'Mông-Miền.</p>
<h3 style="margin-left:0px;"><strong>2. Phương tiện</strong></h3>
<h3 style="margin-left:1em;"><strong>1. QUỐC TẾ</strong></h3>
<p style="margin-left:1em;">Hàng không quốc tế</p>
<h3 style="margin-left:1em;"><strong>2. NỘI ĐỊA</strong></h3>
<p style="margin-left:1em;"><strong>Xe máy và xe đạp:</strong></p>
<p style="margin-left:1em;">Thuê xe đạp hoặc xe máy ở các thành phố ven biển của Việt Nam là một lựa chọn kinh tế hơn.
  Bạn có thể ghé thăm tất cả các điểm tham quan chính mà không dừng lại, và dừng lại và tận hưởng cơ thể.</p>
<p style="margin-left:1em;">Giá thuê xe đạp khoảng 1 đô la / ngày và giá thuê xe máy khoảng 6 đô la / ngày. Giá thuê
  có thể thay đổi tùy theo khu vực và mùa.&nbsp;Nhưng người dân địa phương Việt Nam đang đi xe nhanh, vì vậy hãy chắc
  chắn chú ý đến an toàn.</p>
<p style="margin-left:1em;"><strong>Các phương tiện khác:&nbsp;</strong></p>
<p style="margin-left:1em;"><strong>Xe Ôm</strong></p>
<p style="margin-left:1em;">Là một quốc gia nằm sau xe máy, Mo là phương tiện giao thông phổ biến hơn ở Việt Nam, và
  những người lái xe ở đây cực kỳ hung dữ và có thể dễ dàng đi qua những con hẻm hẹp.&nbsp;Khoảng cách ngắn trong
  thành phố thường là 1-2 đô la.</p>
<p style="margin-left:1em;"><strong>Xe ba bánh (xích lô)</strong></p>
<p style="margin-left:1em;">Xe ba bánh du lịch kiểu Việt Nam, có biệt danh là Guest Guest chết đầu tiên, đang ngồi
  trước hành khách. Người lái xe ngồi sau xe buýt và có thể tận hưởng khung cảnh xung quanh mà không có rào cản. Những
  người không muốn đi bộ hoặc đi xe có thể chọn.&nbsp;Trước khi bạn lên xe buýt, hãy nói chuyện với tài xế về giá cả
  và tránh những tranh chấp không cần thiết.</p>
<h3 style="margin-left:1em;"><strong>3. CÁC PHƯƠNG TIỆN KHÁC</strong></h3>
<p style="margin-left:1em;">Không có&nbsp;</p>
<h3 style="margin-left:0px;"><strong>3. Tiền tệ</strong></h3>
<h3 style="margin-left:1em;"><strong>1. TỶ GIÁ</strong></h3>
<p style="margin-left:1em;">1 USD = 23.000VND (10/2019)&nbsp;</p>
<h3 style="margin-left:1em;"><strong>2. MỨC TIÊU THỤ BÌNH QUÂN 1 NGÀY</strong></h3>
<p style="margin-left:1em;">1,5 lít nước khoáng: 20.000-50.000 đồng,<br>một bát phở&nbsp;20.000-90.000 đồng,<br>một
  cơm chiên 30.000-100.000 đồng, tùy theo cấp bậc và địa điểm của nhà hàng</p>
<h3 style="margin-left:1em;"><strong>3. ĐỔI TIỀN</strong></h3>
<p style="margin-left:1em;">Đồng tiền của Việt Nam là Việt Nam Đồng, viết tắt là VND, đồng đô la Mỹ cũng có thể được
  sử dụng, ngân hàng và một số khách sạn có thể được trao đổi,nhưng tỷ giá hối đoái rất kém.&nbsp;Đồng đô la Mỹ được
  đổi lấy đồng Việt Nam và tỷ giá hối đoái mệnh giá lớn cao hơn tỷ giá hối đoái mệnh giá nhỏ, chẳng hạn như tỷ giá hối
  đoái 100 USD cho tỷ giá hối đoái&gt; 50 USD.&nbsp;&nbsp;</p>
<h3 style="margin-left:1em;"><strong>4. HOÀN THUẾ</strong></h3>
<p style="margin-left:1em;">Người nước ngoài xuất trình cho cơ quan hải quan tại quầy kiểm tra hóa đơn kiêm tờ khai
  hoàn thuế, hàng hóa, các giấy tờ sau đây:</p>
<p style="margin-left:1em;">a) Hộ chiếu hoặc giấy tờ nhập xuất cảnh;</p>
<p style="margin-left:1em;">b) Hóa đơn kiêm tờ khai hoàn thuế;</p>
<p style="margin-left:1em;">c) Hàng hóa.&nbsp;</p>
<h3 style="margin-left:0px;"><strong>4. Mạng &amp; Internet</strong></h3>
<h3 style="margin-left:1em;"><strong>1. MẠNG DI ĐỘNG</strong></h3>
<p style="margin-left:1em;"><br data-cke-filler="true"></p>
<p style="margin-left:1em;">Các nhà mạng phổ biến: Mobiphone, Viettel, Vinaphone,...</p>
<h3 style="margin-left:1em;"><strong>2. INTERNET</strong></h3>
<p style="margin-left:1em;">Mạng 3G, 4G</p>
<p style="margin-left:1em;">Wifi có ở nhiều nơi khách sạn, nhà hàng, quán cà phê,..&nbsp;</p>
<h3 style="margin-left:0px;"><strong>5. Lễ Hội</strong></h3>
<h3 style="margin-left:1em;"><strong>1. LỄ HỘI</strong></h3>
<p style="margin-left:1em;">Những ngày lễ tết quan trọng trong năm tính theo Âm lịch<br>1/1: Tết Nguyên Đán.<br>15/1:
  Tết Nguyên Tiêu (Lễ Thượng Nguyên).<br>3/3: Tết Hàn Thực.<br>10/3: Giỗ Tổ Hùng Vương.<br>15/4: Lễ Phật Đản.<br>5/5:
  Tết Đoan Ngọ.<br>15/7: Lễ Vu Lan.<br>15/8: Tết Trung Thu.<br>9/9: Tết Trùng Cửu.<br>10/10: Tết Thường Tân.<br>15/10:
  Tết Hạ Nguyên.<br>23/12: Tiễn Táo Quân về trời.</p>
<h3 style="margin-left:1em;"><strong>2. LỄ HỘI</strong></h3>
<p style="margin-left:1em;"><strong>Những ngày lễ tết quan trọng trong năm tính theo Âm lịch</strong></p>
<ul>
  <li>1/1: Tết Nguyên Đán.</li>
  <li>15/1: Tết Nguyên Tiêu (Lễ Thượng Nguyên).</li>
  <li>3/3: Tết Hàn Thực.</li>
  <li>10/3: Giỗ Tổ Hùng Vương.</li>
  <li>15/4: Lễ Phật Đản.</li>
  <li>5/5: Tết Đoan Ngọ.</li>
  <li>15/7: Lễ Vu Lan.</li>
  <li>15/8: Tết Trung Thu.</li>
  <li>9/9: Tết Trùng Cửu.</li>
  <li>10/10: Tết Thường Tân.</li>
  <li>15/10: Tết Hạ Nguyên.</li>
  <li>23/12: Tiễn Táo Quân về trời.</li>
</ul>
<h3 style="margin-left:0px;"><strong>6. Lời Khuyên</strong></h3>
<h3 style="margin-left:1em;"><strong>1. THÔNG TIN LIÊN HỆ QUAN TRỌNG</strong></h3>
<p style="margin-left:1em;"><strong>Các số điện thoại khẩn cấp:</strong></p>
<ul>
  <li>Cứu thương 115</li>
  <li>Phòng cháy chữa cháy 114</li>
  <li>Cảnh sát cơ động 113</li>
</ul>
<h3 style="margin-left:1em;"><strong>2. CÁC ỨNG DỤNG HỮU ÍCH</strong></h3>
<p style="margin-left:1em;"><strong>Các app ứng dụng du lịch&nbsp;hữu ích:&nbsp;</strong></p>
<ul>
  <li>Google Map</li>
  <li>Google Dịch&nbsp;</li>
  <li>Foody&nbsp;</li>
  <li>Grab&nbsp;</li>
  <li>Agoda</li>
  <li>Air BnB</li>
</ul>
<h3 style="margin-left:1em;"><strong>3. Y TẾ</strong></h3>
<p style="margin-left:1em;">Liên hệ bệnh viện gần nhất</p>
<h3 style="margin-left:0px;"><strong>7. Ẩm thực</strong></h3>
<h3 style="margin-left:1em;"><strong>1. ẨM THỰC</strong></h3>
<h3 style="margin-left:1em;"><strong>2. ẨM THỰC</strong></h3>
<ul>
  <li>Phở Một&nbsp;món ăn&nbsp;không thể thiếu khi nói về ẩm thực&nbsp;Việt. ...</li>
  <li>Bún chả&nbsp;</li>
  <li>Xôi.</li>
  <li>Bánh xèo.&nbsp;</li>
  <li>Gỏi cuốn và nem rán.&nbsp;</li>
  <li>Bún bò&nbsp;Nam&nbsp;bộ&nbsp;</li>
  <li>Cao lầu.</li>
  <li>Bánh mỳ</li>
  <li>Bột chiên</li>
  <li>Cà phê trứng</li>
</ul>
<h3 style="margin-left:0px;"><strong>8. Thị thực</strong></h3>
<h3 style="margin-left:1em;"><strong>1. CÁCH XIN THỊ THỰC</strong></h3>
<p style="margin-left:1em;">Không&nbsp;</p>
<h3 style="margin-left:1em;"><strong>2. THỊ THỰC</strong></h3>
<p style="margin-left:1em;">Không&nbsp;</p>
<h3 style="margin-left:1em;"><strong>3. LOẠI THỊ THỰC</strong></h3>
<p style="margin-left:1em;">Không</p>
<h3 style="margin-left:0px;"><strong>9. Xuất - Nhập Cảnh</strong></h3>
<h3 style="margin-left:1em;"><strong>1. QUY ĐỊNH NHẬP CẢNH</strong></h3>
<ul>
  <li>Xuấtcảnh là việc công dân Việt Nam ra khỏi lãnh thổ Việt Nam qua cửa khẩu của Việt Nam.</li>
  <li>Nhập cảnh là việc công dân Việt Nam từ nước ngoài vào lãnh thổ Việt Nam qua cửa khẩu của Việt Nam.</li>
  <li>Giấy tờ xuất nhập cảnh là giấy tờ do cơ quan có thẩm quyền của Việt Nam cấp cho công dân Việt Nam để xuất cảnh,
    nhập cảnh.</li>
  <li>Cửakhẩu là nơi công dân Việt Nam xuất cảnh, nhập cảnh theo quy định của pháp luật Việt Nam hoặc điều ước quốc tế
    mà Việt Nam là thành viên.</li>
  <li>Kiểm soát xuất nhập cảnh là việc đơn vị kiểm soát xuất nhập cảnh tại cửa khẩu thực hiện chức năng kiểm tra, kiểm
    soát, kiểm chứng giấy tờ xuất nhập cảnhtheo quy định của pháp luật.</li>
  <li>Tạm hoãn xuất cảnh là việc cơ quan, người có thẩm quyền ra quyết định tạm dừng xuất cảnh có thời hạn đối với
    công dân Việt Nam.</li>
  <li>Cơ sở dữ liệu quốc gia về xuất cảnh, nhập cảnh của công dân Việt Nam là tập hợp thông tin về họ, chữ đệm và tên;
    ngày, tháng, năm sinh; ảnh chân dung; giới tính; vân tay; số chứng minh nhân dân hoặc số định danh cá nhân; số,
    ngày cấp, cơ quan cấp giấy tờ xuất nhập cảnh; quá trình xuất cảnh, nhập cảnh và các thông tin có liên quan khác
    được số hóa, lưu trữ, quản lý và khai thác bằng cơ sở hạ tầng thông tin và kết nối với cơ sở dữ liệu căn cước công
    dân, tội phạm, quốc tịch và các cơ sở dữ liệu khác để chia sẻ, khai thác và xử lý thông tin liên quan đến xuất
    cảnh, nhập cảnh của công dân Việt Nam.</li>
</ul>
<h3 style="margin-left:1em;"><strong>2. QUY ĐỊNH XUẤT CẢNH</strong></h3>
<ul>
  <li>Xuấtcảnh là việc công dân Việt Nam ra khỏi lãnh thổ Việt Nam qua cửa khẩu của Việt Nam.</li>
  <li>Nhập cảnh là việc công dân Việt Nam từ nước ngoài vào lãnh thổ Việt Nam qua cửa khẩu của Việt Nam.</li>
  <li>Giấy tờ xuất nhập cảnh là giấy tờ do cơ quan có thẩm quyền của Việt Nam cấp cho công dân Việt Nam để xuất cảnh,
    nhập cảnh.</li>
  <li>Cửakhẩu là nơi công dân Việt Nam xuất cảnh, nhập cảnh theo quy định của pháp luật Việt Nam hoặc điều ước quốc tế
    mà Việt Nam là thành viên.</li>
  <li>Kiểm soát xuất nhập cảnh là việc đơn vị kiểm soát xuất nhập cảnh tại cửa khẩu thực hiện chức năng kiểm tra, kiểm
    soát, kiểm chứng giấy tờ xuất nhập cảnhtheo quy định của pháp luật.</li>
  <li>Tạm hoãn xuất cảnh là việc cơ quan, người có thẩm quyền ra quyết định tạm dừng xuất cảnh có thời hạn đối với
    công dân Việt Nam.</li>
  <li>Cơ sở dữ liệu quốc gia về xuất cảnh, nhập cảnh của công dân Việt Nam là tập hợp thông tin về họ, chữ đệm và tên;
    ngày, tháng, năm sinh; ảnh chân dung; giới tính; vân tay; số chứng minh nhân dân hoặc số định danh cá nhân; số,
    ngày cấp, cơ quan cấp giấy tờ xuất nhập cảnh; quá trình xuất cảnh, nhập cảnh và các thông tin có liên quan khác
    được số hóa, lưu trữ, quản lý và khai thác bằng cơ sở hạ tầng thông tin và kết nối với cơ sở dữ liệu căn cước công
    dân, tội phạm, quốc tịch và các cơ sở dữ liệu khác để chia sẻ, khai thác và xử lý thông tin liên quan đến xuất
    cảnh, nhập cảnh của công dân Việt Nam.</li>
</ul>
</div>
`;

const DiscoveryCountry: NextPage = (props: IDiscoveryCountryProps) => {
  return (
    <Box w='full'>
      <Box mx='6'>
        <Box mb='4'>
          <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
            <BreadcrumbItem>
              <Link href='/discovery'>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Khám phá</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem isCurrentPage>
              <Link href='/discovery/viet-nam'>
                <BreadcrumbLink _hover={{ textDecoration: 'none' }}>Việt Nam</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Heading mb='8' textTransform='uppercase' color='#D0637C'>
          Việt nam
        </Heading>
      </Box>
      <Flex justify='space-between' w='full' align='flex-start' gap={6}>
        <Box w='20%' bg='white' shadow='md' border='1px' borderColor='gray.300' p='6' h='fit-content' position='sticky' top='20'>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4' color='#D0637C'>
            <Text>Thông tin chung</Text>
            <ChevronRightIcon />
          </Flex>
          <Link href='/discovery/viet-nam/provinces'>
            <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
              <Text>Tỉnh - Thành phố</Text>
              <ChevronRightIcon />
            </Flex>
          </Link>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>Kinh nghiệm</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>Hình ảnh</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center' mb='4'>
            <Text>Hỏi đáp</Text>
            <ChevronRightIcon />
          </Flex>
          <Flex cursor='pointer' justify='space-between' align='center'>
            <Text>Hành trình</Text>
            <ChevronRightIcon />
          </Flex>
        </Box>
        <Box w='80%' bg='white' p='6' h='fit-content' flexGrow='1' shadow='lg' rounded='md'>
          {/* <Stack direction='row' h='70px' border='1px' borderColor='gray.300' mb='4' p='6'>
            <Divider orientation='vertical' bgColor='black' />
            <Text>Chào mừng bạn đến với Việt Nam</Text>
          </Stack> */}
          <Box border='1px' borderColor='gray.300' mb='4' p='6'>
            <Text borderLeft='1px' borderColor='gray.500' px='2'>
              Chào mừng bạn đến với{' '}
              <Highlight query='Việt Nam' styles={{ px: '1', py: '1', bg: 'red.100', rounded: 'lg' }}>
                Việt Nam
              </Highlight>
            </Text>
          </Box>
          <AspectRatio ratio={16 / 9} rounded='md' mb='4'>
            <iframe src='https://maps.google.com/maps?q=${vietnam}&t=&z=13&ie=UTF8&iwloc=&output=embed' />
          </AspectRatio>
          <Box>
            <Prose dangerouslySetInnerHTML={{ __html: temp }} />
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default DiscoveryCountry;

export const getServerSideProps: GetServerSideProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['header', 'footer', 'modal_is_first_login'])),
      // Will be passed to the page component as props
    },
  };
};
