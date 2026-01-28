-- AppleScript: 自动布局 Cursor 和 iOS 模拟器窗口
-- 左边 2/3: Cursor，右边 1/3: iOS 模拟器

on run
    -- 获取屏幕尺寸
    tell application "System Events"
        set screenSize to size of desktop
        set screenWidth to item 1 of screenSize
        set screenHeight to item 2 of screenSize
    end tell
    
    -- 计算窗口位置
    set cursorWidth to screenWidth * 2 / 3
    set simulatorX to cursorWidth
    set simulatorWidth to screenWidth - cursorWidth
    
    -- 布局 Cursor 窗口（左边 2/3）
    tell application "Cursor"
        activate
        delay 0.5
        
        try
            set bounds of front window to {0, 0, cursorWidth, screenHeight}
        on error
            -- 如果获取窗口失败，尝试创建新窗口
            tell application "System Events"
                tell process "Cursor"
                    click menu item "New Window" of menu "File" of menu bar 1
                end tell
            end tell
            delay 1
            set bounds of front window to {0, 0, cursorWidth, screenHeight}
        end try
    end tell
    
    -- 布局 iOS 模拟器窗口（右边 1/3）
    tell application "Simulator"
        activate
        delay 0.5
        
        try
            set bounds of front window to {simulatorX, 0, screenWidth, screenHeight}
        on error
            -- 如果模拟器还没打开，等待一下
            delay 2
            try
                set bounds of front window to {simulatorX, 0, screenWidth, screenHeight}
            end try
        end try
    end tell
    
    -- 最后激活 Cursor（让它在前面）
    tell application "Cursor"
        activate
    end tell
end run
