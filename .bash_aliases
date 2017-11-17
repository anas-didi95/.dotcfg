# Compile shortcut
alias cc='g++ -std=c++11' # C++
#--------------------------------------------#
alias jc='javac' # Java

# Compare output
alias ccomp='./a.out < in | diff -s - ans'
alias ccomp1='./a.out < in1 | diff -s - ans1'
alias ccomp2='./a.out < in2 | diff -s - ans2'
alias ccomp3='./a.out < in3 | diff -s - ans3'
alias ccomp4='./a.out < in4 | diff -s - ans4'
#--------------------------------------------#
alias jcomp='java Main < in | diff -s - ans'
alias jcomp1='java Main < in1 | diff -s - ans1'
alias jcomp2='java Main < in2 | diff -s - ans2'
alias jcomp3='java Main < in3 | diff -s - ans3'
alias jcomp4='java Main < in4 | diff -s - ans4'

#alias vim='gvim'

# Recommendation for compressing JPG files with ImageMagick
# http://stackoverflow.com/questions/7261855/recommendation-for-compressing-jpg-files-with-imagemagick 
alias imgweb='convert -strip -interlace Plane -gaussian-blur 0.05 -quality 85%'

# Make offline mirror using 'wget'
# https://www.guyrutenberg.com/2014/05/02/make-offline-mirror-of-a-site-using-wget/
# http://www.linuxjournal.com/content/downloading-entire-web-site-wget
alias dl-web='wget -mkEpnp --timestamping'

# Copy the ssh public key, require the xclip package
# https://gitlab.com/help/ssh/README
alias ssh-copy-pub='xclip -sel clip < ~/.ssh/id_rsa.pub'

# Use ssh to any host that has your public key without having to enter a password
alias ssh-init='eval "$(ssh-agent -s)" && ssh-add'

# Git shorcut
alias gst='git status'
alias ga='git add'
alias gc='git commit'
alias gph='git push'
alias gpl='git pull'
alias gl='git log'
alias gd='git diff'

# MySQL Dev
alias mysqldev='mysql -uuser -ppassword'

# KICT Server
# username: zahidah (normal)
# password: password
alias kictzahidah='ssh zahidah@10.101.237.102'
# username: root (super user)
# password: password
alias kictroot='ssh root@10.101.237.102'
