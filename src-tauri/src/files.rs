use trash;

pub fn move_to_trash(file_path: &str) {
    // 将文件移动到回收站
    match trash::delete(file_path) {
        Ok(_) => {
          println!("文件已成功移动到回收站");
        },
        Err(err) => {
          println!("移动文件到回收站时出现错误: {}", err);
        },
    }
}
