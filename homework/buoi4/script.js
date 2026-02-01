class TaskTracker {
    constructor() {
        // Lấy dữ liệu từ LocalStorage hoặc khởi tạo mảng rỗng
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.filterType = 'all'; // Trạng thái bộ lọc hiện tại
        
        // Cache DOM elements
        this.taskInput = document.getElementById('taskInput');
        this.taskList = document.getElementById('taskList');
        this.stats = document.getElementById('stats');
        this.addBtn = document.getElementById('addBtn');
        this.filters = document.querySelectorAll('.filters span');
        this.clearBtn = document.getElementById('clearAll');

        // Khởi tạo các sự kiện
        this.initEvents();
        this.render();
    }

    // --- Core Methods (CRUD) ---

    add(title) {
        if (!title.trim()) return alert("Vui lòng nhập nội dung!");
        const newTask = {
            id: Date.now(),
            title: title,
            completed: false
        };
        this.tasks.unshift(newTask); // Thêm vào đầu danh sách
        this.saveAndRender();
    }

    delete(id) {
        if(confirm("Bạn chắc chắn muốn xóa?")) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveAndRender();
        }
    }

    toggle(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveAndRender();
    }

    edit(id) {
        const task = this.tasks.find(t => t.id === id);
        // Vip Pro: Không dùng prompt, dùng inline edit
        const newTitle = prompt("Sửa công việc:", task.title); 
        if (newTitle !== null && newTitle.trim() !== "") {
            task.title = newTitle;
            this.saveAndRender();
        }
    }

    clearAll() {
        if(confirm("Xóa sạch danh sách?")) {
            this.tasks = [];
            this.saveAndRender();
        }
    }

    // --- Helper Methods ---

    saveAndRender() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.render();
    }

    updateStats() {
        const pendingCount = this.tasks.filter(t => !t.completed).length;
        this.stats.innerText = pendingCount === 0 
            ? "Tuyệt vời! Bạn đã hoàn thành hết." 
            : `Còn ${pendingCount} công việc cần làm.`;
    }

    render() {
        this.taskList.innerHTML = '';
        
        // Lọc task theo tab đang chọn
        const filteredTasks = this.tasks.filter(task => {
            if (this.filterType === 'completed') return task.completed;
            if (this.filterType === 'pending') return !task.completed;
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <span onclick="app.toggle(${task.id})" style="cursor:pointer; flex:1">
                    <i class="far ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i> 
                    ${task.title}
                </span>
                <div class="actions">
                    <button class="btn-edit" onclick="app.edit(${task.id})"><i class="fas fa-pen"></i></button>
                    <button class="btn-delete" onclick="app.delete(${task.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            this.taskList.appendChild(li);
        });

        this.updateStats();
    }

    // --- Event Listeners ---
    
    initEvents() {
        // Thêm task khi click nút hoặc ấn Enter
        this.addBtn.addEventListener('click', () => {
            this.add(this.taskInput.value);
            this.taskInput.value = '';
        });

        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.add(this.taskInput.value);
                this.taskInput.value = '';
            }
        });

        // Xử lý bộ lọc
        this.filters.forEach(span => {
            span.addEventListener('click', (e) => {
                document.querySelector('.filters .active').classList.remove('active');
                e.target.classList.add('active');
                this.filterType = e.target.dataset.filter;
                this.render();
            });
        });

        this.clearBtn.addEventListener('click', () => this.clearAll());
    }
}

// Khởi tạo ứng dụng
const app = new TaskTracker();