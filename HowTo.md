// Cách handle click out side to delete model
1. Khởi tạo 1 ref cho biến để access vào DOM và nên set NULL cho nó 

ví dụ

    const menuRef = useRef(HTMLDIVElement)<null>;

2. khởi useState có 2 para là isOpenv và setOpen và default là false

ví dụ
    const  [isOpen, setOpen] = useState(false);

3. Sử dụng useEffect để detect modal xem có click vào không

ví dụ
useEffect(() => {
    const handleClickOutSide = (event : MouseEvent) => {
        if ( menuRef.current  && menuRef.current.contains(event target as Node)){
            setOpen(false);
        }
    }
})

4. trả về sự kiện và để tránh tình trạng memory leak thì nên xóa Event khi hoàn thành 1 event

ví dụ
    document.addEventListener("mousedown", handleClickOutSide)
    return ()=> {
        document.removeEventListener("mousdown",handleClickOutSide)
    }

Full Code
    const [isOpen, setOpenModal] = useState(false);
    useEffect(() => {
        const handleClickOutSide = (event : MouseEvent) =>{ 
            if ( menuRef.current && menuRef.current.contains(event target as Node)) ==> thực ra chỉ cần event target là đủ tuy nhiến event target rất chung chung nên ta phải ép kiếu nó về 1 Node đảm bảo rằng event target là 1 node để .contains() có thể gặp lỗi trong tương lai
            vì nếu như bật chế độ strict trong tsconfig.js thì 100% typescript sẽ báo lỗi
            {
                setOpen(false);
            }
        }
    },[]) ==> truyền 1 mảng rỗng để useEffect chạy được chỉ 1 lần sau khi render lần đầu tiền mà không phải render lại 
    * thực tế
    ví dụ ta có 2 modal muốn delete khi click outside
    thì khi ta click 1 button để mở modal là lúc useEffect bắt đầu render
    và nếu ta bấm 1 button khác để mở modal khác thì để tránh tình trạng modal đầu tiên phải render lại thì truyền 1 mảng rỗng để chạy 1 lần duy nhất 

5. truyền giá trị ref và open vào DOM
<div className = "modal-container" ref = {menuRef}>
    <button onClick={() => setOpen(!isOpen)}/>
    <Model isOpen={isOpen} />
</div>