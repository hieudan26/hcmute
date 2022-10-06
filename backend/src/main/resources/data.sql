INSERT IGNORE INTO users (id,created_date,last_mod_date,role,is_disable) VALUES ('1',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'123',false);
INSERT IGNORE INTO countries (name,is_disable) VALUES
    ('Việt Nam',false);
INSERT IGNORE INTO provinces (name,country_id,is_disable) VALUES
                                           ( 'An Giang',1,false),
( 'Bà Rịa-Vũng Tàu',1,false),
( 'Bắc Giang',1,false),
( 'Bắc Kạn',1,false),
( 'Bạc Liêu',1,false),
( 'Bắc Ninh',1,false),
( 'Bến Tre',1,false),
( 'Bình Dương',1,false),
( 'Bình Định',1,false),
( 'Bình Phước',1,false),
( 'Bình Thuận',1,false),
( 'Cà Mau',1,false),
( 'Cần Thơ',1,false),
( 'Cao Bằng',1,false),
( 'Đà Nẵng',1,false),
( 'Đắk Lắk',1,false),
( 'Đắk Nông',1,false),
( 'Điện Biên',1,false),
( 'Đồng Nai',1,false),
( 'Đồng Tháp',1,false),
( 'Gia Lai',1,false),
( 'Hà Giang',1,false),
( 'Hà Nam',1,false),
( 'Hà Nội',1,false),
( 'Hà Tĩnh',1,false),
( 'Hải Dương',1,false),
( 'Hải Phòng',1,false),
( 'Hậu Giang',1,false),
( 'Hồ Chí Minh',1,false),
( 'Hòa Bình',1,false),
( 'Hưng Yên',1,false),
( 'Khánh Hòa',1,false),
( 'Kiên Giang',1,false),
( 'Kon Tum',1,false),
( 'Lai Châu',1,false),
( 'Lâm Đồng',1,false),
( 'Lạng Sơn',1,false),
( 'Lào Cai',1,false),
( 'Long An',1,false),
( 'Nam Định',1,false),
( 'Nghệ An',1,false),
( 'Ninh Bình',1,false),
( 'Ninh Thuận',1,false),
( 'Phú Thọ',1,false),
( 'Phú Yên',1,false),
( 'Quảng Bình',1,false),
( 'Quảng Nam',1,false),
( 'Quảng Ngãi',1,false),
( 'Quảng Ninh',1,false),
( 'Quảng Trị',1,false),
( 'Sóc Trăng',1,false),
( 'Sơn La',1,false),
( 'Tây Ninh',1,false),
( 'Thái Bình',1,false),
( 'Thái Nguyên',1,false),
( 'Thanh Hóa',1,false),
( 'Thừa Thiên-Huế',1,false),
( 'Tiền Giang',1,false),
( 'Trà Vinh',1,false),
( 'Tuyên Quang',1,false),
( 'Vĩnh Long',1,false),
( 'Vĩnh Phúc',1,false),
( 'Yên Bái',1,false);
