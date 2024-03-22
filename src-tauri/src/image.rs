use base64::{
  engine::{general_purpose},
  Engine as _,
};
use image::{self, DynamicImage, FilterType};

// 将 DynamicImage 转换为 base64 字符串
fn dynamic_image_to_base64(image: &DynamicImage, quality: u8) -> String {
  // 将 DynamicImage 编码为 JPEG 格式的字节数据
  let mut buf = Vec::new();
  image
      .write_to(&mut buf, image::ImageOutputFormat::JPEG(quality))
      .expect("Failed to encode image");

  // 将字节数据转换为 base64 字符串
  let base64_str = general_purpose::STANDARD.encode(&buf);

  base64_str
}
/**
 * path 图片地址
 * size 裁剪宽高 
 * quality 压缩质量 0-100
 */
pub fn get_image_base64(path: &str, size: u32, quality: u8) -> String {
  let image_result: Result<DynamicImage, image::ImageError> = image::open(path);
  // 检查图像是否成功打开
  match image_result {
      Ok(image) => {
          // 调整图像大小
          let resized_image = image.resize(size, size, FilterType::Nearest);

          // 保存调整大小后的图像
          resized_image
              .save("/Users/hao/Projects/rust-demo/img/22.png")
              .unwrap(); // 注意处理保存图像可能出现的错误

          // 将调整大小后的图像转换为 base64 字符串
          let base64_str = dynamic_image_to_base64(&resized_image, quality);
          // 在这里可以对图像进行进一步的处理，比如显示、保存等
          base64_str
      }
      Err(err) => {
          eprintln!("Error loading image: {}", err);
          let res = "";
          res.to_owned()
      }
  }
}